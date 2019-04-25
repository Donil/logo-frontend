import {
  Component,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnDestroy,
  ViewContainerRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { filter, map, switchMap, takeUntil, tap, merge, startWith, withLatestFrom, mapTo, publishReplay, refCount } from 'rxjs/operators';

import { BusinessCard } from '../../core/models/business-card';
import { ImageFormat } from '../../core/models/image-format';
import { Shape } from '../../core/models/shape';
import { BusinessCardsService } from '../../core/services/business-cards.service';
import { FilesService } from '../../core/services/files.service';
import { UserService } from '../../core/services/user.service';
import { ConfirmDialogData } from '../../shared/confirm-dialog/confirm-dialog-data';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';
import { PainterCanvasComponent } from '../painter-canvas/painter-canvas.component';
import { SelectBusinessCardDialogComponent } from '../select-business-card-dialog/select-business-card-dialog.component';
import { SelectShapeDialogComponent } from '../select-shape-dialog/select-shape-dialog.component';

const UPDATE_CANVAS_SIZE_TIMEOUT = 300;

/**
 * Business card painter component.
 */
@Component({
  selector: 'cl-painter',
  templateUrl: './painter.component.html',
  styleUrls: [
    './painter.component.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PainterComponent implements OnDestroy {
  private readonly destroy$ = new Subject<void>();
  private readonly openBusinessCard$ = new Subject<void>();
  private readonly createNewBusinessCard$ = new Subject<void>();

  /**
   * .ctor
   * @param userService User service.
   * @param dialogService Dialog service.
   * @param router Router.
   * @param filesService Files service.
   * @param businessCardsService Business cards service.
   */
  public constructor(
    private userService: UserService,
    private dialogService: MatDialog,
    private router: Router,
    private filesService: FilesService,
    private businessCardsService: BusinessCardsService) {
    this.businessCard$ = this.createBusinessCardStream();
  }

  /**
   * Current business card.
   */
  public businessCard$: Observable<BusinessCard>;

  /**
   * Is sidebar visible.
   */
  public isSidebarVisible$ = new BehaviorSubject<boolean>(true);

  /**
   * Painter canvas component.
   */
  @ViewChild(PainterCanvasComponent)
  public painterCanvas: PainterCanvasComponent;

  /**
   * An anchor html element for init file downloading on client.
   */
  @ViewChild('downloadFileAnchor')
  public downloadFileAnchor: ElementRef<HTMLAnchorElement>;

  /**
   * Is authorized change.
   */
  public get isAutorizedChange(): Observable<boolean> {
    return this.userService.isAutorizedChange;
  }

  /**
   * Can undo.
   */
  public get canUndo(): boolean {
    return this.painterCanvas.canUndo;
  }

  /**
   * Can redo.
   */
  public get canRedo(): boolean {
    return this.painterCanvas.canRedo;
  }

  /**
   * @inheritDoc
   */
  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * On "logic" action click.
   */
  public onLoginClick(): void {
    this.router.navigate(['/login']);
  }

  /**
   * On "undo" click event handler.
   */
  public onUndoClick(): void {
    this.painterCanvas.undo();
  }

  /**
   * On "redo" click event handler.
   */
  public onRedoClick(): void {
    this.painterCanvas.redo();
  }

  /**
   * Toggle sidebar visible.
   */
  public onToggleSidebarClick(): void {
    this.isSidebarVisible$.next(!this.isSidebarVisible$.value);
    // This need for resize canvas.
    setTimeout(() => this.painterCanvas.updateCanvasSize(), UPDATE_CANVAS_SIZE_TIMEOUT);
  }

  /**
   * On "add text" click event handler.
   */
  public onAddTextClick(): void {
    this.painterCanvas.addText();
  }

  /**
   * On "add shape" click event handler.
   */
  public onAddShapeClick(): void {
    this.selectShapeAndAdd();
  }

  /**
   * Show shapes list for select shape to add.
   */
  private selectShapeAndAdd(): void {
    this.dialogService.open(SelectShapeDialogComponent)
      .afterClosed()
      .subscribe((shape: Shape) => {
        if (shape) {
          // Add this shape to the canvas.
          this.painterCanvas.addShape(shape);
        }
      });
  }

  /**
   * On adding image input change.
   * @param event Event data.
   */
  public onInputImageChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.filesService.upload(input.files[0]).pipe(
        takeUntil(this.destroy$),
      )
      .subscribe(imageUrl => this.painterCanvas.addImage(imageUrl));
  }

  /**
   * On "create new" event handler.
   */
  public onCreateNewClick(): void {
    this.createNewBusinessCard$.next();
  }

  /**
   * On "open" click event handler.
   */
  public onOpenClick(): void {
    this.openBusinessCard$.next();
  }

  /**
   * On "save" click event handler.
   */
  public onSaveClick(): void {
    // Firstly save thumbnail
    const format = ImageFormat.Jpeg;
    const data = this.painterCanvas.toDataURL(format);
    this.filesService.uploadBase64(data, format)
      .pipe(
        withLatestFrom(this.businessCard$),
        switchMap(([thumbnailUrl, businessCard]) => {
          businessCard.thumbnailUrl = thumbnailUrl;
          businessCard.data = JSON.stringify(this.painterCanvas.toJSON());
          return this.businessCardsService.save(businessCard);
        }),
        takeUntil(this.destroy$),
      )
      .subscribe();
  }

  /**
   * Download business card.
   * @param format Image format.
   */
  public onDownloadClick(format: ImageFormat): void {

    let upload$: Observable<string>;

    if (format === ImageFormat.Svg) {
      const data = this.painterCanvas.toSVG();
      upload$ = this.filesService.uploadSvg(data);
    } else {
      const data = this.painterCanvas.toDataURL(format);
      upload$ = this.filesService.uploadBase64(data, format);
    }
    // Init downloading after success upload.
    upload$.subscribe(url => this.initDownloadFile(url, `card.${format}`));
  }

  private initDownloadFile(url: string, fileName: string): void {
    // TODO: Move this to template and get reference to element.
    const anchor = this.downloadFileAnchor.nativeElement;
    anchor.href = url;
    anchor.download = fileName;
    // Then click the link:
    anchor.click();
  }

  private createBusinessCardStream(): Observable<BusinessCard> {
    const openBusinessCard$ = this.openBusinessCard$.pipe(
      switchMap(() => this.dialogService.open(SelectBusinessCardDialogComponent).afterClosed()),
      map(card => card as BusinessCard),
      filter(card => card != null),
    );

    const createNewBusinessCard$ = this.createNewBusinessCard$.pipe(
      switchMap(() => {
        const data: ConfirmDialogData = {
          message: 'Do you really want to create new card? All unsaved data will be lost.',
        };
        return this.dialogService.open(ConfirmDialogComponent, { data })
          .afterClosed();
      }),
      filter(dialogResult => dialogResult as boolean),
      mapTo(new BusinessCard()),
    );
    // After successed login load latest business card of current user.
    return this.userService.isAutorizedChange
      .pipe(
        takeUntil(this.destroy$),
        filter(isAuthorized => isAuthorized),
        switchMap(() => this.businessCardsService.getAll()),
        filter(cards => cards.length > 0),
        map(cards => cards.pop()),
        merge(openBusinessCard$, createNewBusinessCard$),
        tap(card => this.painterCanvas.loadFromJSON(card.data)),
        // TODO: this does not work, but I don't know why. // startWith(new BusinessCard()),
        publishReplay(1),
        refCount(),
      );
  }
}
