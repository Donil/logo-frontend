import { Component, OnChanges, Input, SimpleChanges, EventEmitter, Output, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { switchMap, mapTo, takeUntil } from 'rxjs/operators';

import { Category } from '../../core/models/category';
import { Shape } from '../../core/models/shape';
import { FilesService } from '../../core/services/files.service';
import { ShapesService } from '../../core/services/shapes.service';

/**
 * Add shape component.
 */
@Component({
  selector: 'ad-add-shape',
  templateUrl: './add-shape.component.html',
  styleUrls: [
    './add-shape.component.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddShapeComponent implements OnChanges, OnDestroy {
  private destroy$ = new Subject();

  /**
   * .ctor
   * @param shapesService Shapes service.
   * @param filesService Files service.
   */
  public constructor(
    private shapesService: ShapesService,
    private filesService: FilesService) {
  }

  /**
   * Selected file.
   */
  public selectedFile: File;

  /**
   * Categories of addeding shape.
   */
  @Input()
  public categories: Category[];

  /**
   * Successed add event.
   */
  @Output()
  public shapeAdded = new EventEmitter<Shape>();

  /**
   * Selected categoties as string.
   */
  public categoriesAsString: string;

  /**
   * Is uploading in progress.
   */
  public isUploading$ = new BehaviorSubject<boolean>(false);

  /**
   * Name of adding shape.
   */
  public shapeName: string;

  /**
   * @inheritDoc
   */
  public ngOnChanges(changes: SimpleChanges): void {
    if ('categories' in changes && this.categories) {
      this.categoriesAsString = this.categories.map(t => t.name).join(' ');
    }
  }

  /**
   * @inheritdoc
   */
  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Value changed callback of input file.
   * @param event Event data.
   */
  public onFileChange(event: Event): void {
    const inputElement = (event.target as HTMLInputElement);
    this.selectedFile = inputElement.files[0];
  }

  /**
   * Add shape.
   */
  public onSubmit(form: NgForm): void {
    if (form.invalid) {
      return;
    }

    this.isUploading$.next(true);
    // Upload file
    this.filesService.upload(this.selectedFile)
      .pipe(
        switchMap(fileUrl => this.createShape(fileUrl)),
        takeUntil(this.destroy$),
      )
      .subscribe(shape => {
        this.isUploading$.next(false);
        this.shapeAdded.emit(shape);
      });
  }

  /**
   * Create shape base on uploaded file url.
   * @param fileUrl Url of file.
   */
  private createShape(fileUrl: string): Observable<Shape> {
    const shape = new Shape();
    shape.name = this.shapeName;
    shape.url = fileUrl;
    shape.categories = this.categoriesAsString.split(' ');
    return this.shapesService
      .create(shape)
      .pipe(mapTo(shape));
  }
}
