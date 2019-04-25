import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  EventEmitter,
  Output,
  OnDestroy,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { from } from 'rxjs';
import { mapTo, mergeMap, reduce, switchMap, takeUntil } from 'rxjs/operators';

import { Category } from '../../core/models/category';
import { Shape } from '../../core/models/shape';
import { FilesService } from '../../core/services/files.service';
import { ShapesService } from '../../core/services/shapes.service';

/**
 * Import shapes component.
 */
@Component({
  selector: 'ad-import-shapes',
  templateUrl: './import-shapes.component.html',
  styleUrls: [
    './import-shapes.component.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImportShapesComponent implements OnChanges, OnDestroy {
  private selectedFiles: File[];
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
   * Categories of importing shapes.
   */
  @Input()
  public categories: Category[];

  /**
   * Import successed event.
   */
  @Output()
  public imported = new EventEmitter<Shape[]>();

  /**
   * Categories of shapes as string.
   */
  public categoriesAsString: string;

  /**
   * Is uploading in progress.
   */
  public isUploading = false;

  /**
   * Selected files names.
   */
  public selectedFilesNames: string;

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
   * Selected files changed callback.
   * @param e Event data.
   */
  public onFilesChange(e: Event): void {
    const files = (e.target as HTMLInputElement).files;
    this.selectedFiles = [];
    for (let i = 0; i < files.length; i++) {
      this.selectedFiles.push(files.item(i));
    }
    this.selectedFilesNames = this.selectedFiles.map(f => f.name).join(';');
  }

  /**
   * Uplaod selected files.
   */
  public onSubmit(): void {
    this.isUploading = true;

    from(this.selectedFiles)
      .pipe(
        mergeMap(file => this.createShapeFromFile(file)),
        reduce<Shape, Shape[]>((acc, shape) => {
            acc.push(shape);
            return acc;
          }, []),
          takeUntil(this.destroy$),
      )
      .subscribe(shapes => {
        this.isUploading = false;
        this.imported.emit(shapes);
      });
    }

    /**
     * Create shape based on file.
     * @param file Files of shape.
     */
    private createShapeFromFile(file: File): Observable<Shape> {
      const shape = new Shape();
      shape.name = file.name.substring(0, file.name.lastIndexOf('.'));
      shape.categories = this.categoriesAsString.split(' ');
      return this.filesService.upload(file)
        .pipe(switchMap(fileUrl => {
            shape.url = fileUrl;
            return this.shapesService.create(shape);
          }),
          mapTo(shape),
        );
    }
}
