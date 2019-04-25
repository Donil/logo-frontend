import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { MatDialog } from '@angular/material';
import { BehaviorSubject, Observable, NEVER, of, Subject } from 'rxjs';
import { merge, switchMap, publishReplay, refCount, filter, map, mapTo, withLatestFrom } from 'rxjs/operators';

import { Category } from '../../core/models/category';
import { Shape } from '../../core/models/shape';
import { ShapesService } from '../../core/services/shapes.service';
import { ConfirmDialogData } from '../../shared/confirm-dialog/confirm-dialog-data';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';
import { AddShapeDialogData } from '../add-shape-dialog/add-shape-dialog-data';
import { AddShapeDialogComponent } from '../add-shape-dialog/add-shape-dialog.component';
import { ImportShapesDialogData } from '../import-shapes-dialog/import-shapes-dialog-data';
import { ImportShapesDialogComponent } from '../import-shapes-dialog/import-shapes-dialog.component';

/**
 * Shapes manegemnt grid view component.
 */
@Component({
  selector: 'ad-shapes-management-grid',
  templateUrl: './shapes-management-grid.component.html',
  styleUrls: [
    './shapes-management-grid.component.css',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShapesManagementGridComponent {
  private category$ = new BehaviorSubject<Category>(null);
  private createShape$ = new Subject<Category>();
  private removeShape$ = new Subject<Shape>();
  private importShapes$ = new Subject<void>();

  /**
   * .ctor
   * @param shapesService Shapes service.
   * @param dialogService Dialog service.
   */
  public constructor(
    private shapesService: ShapesService,
    private dialogService: MatDialog,
  ) {
    this.shapes$ = this.createShapesStream();
  }

  @Input()
  public set category(value: Category) {
    this.category$.next(value);
  }

  /**
   * Shapes lsit.
   */
  public shapes$: Observable<Shape[]>;

  /**
   * On "Add shape" click event handler.
   */
  public onAddShapeClick(): void {
    this.createShape$.next();
  }

  /**
   * On "Remove shape" click event handler.
   * @param shape Removing shape.
   */
  public onRemoveShapeClick(shape: Shape): void {
    this.removeShape$.next(shape);
  }

  /**
   * On "import shapes" click event handler.
   */
  public onImportShapeClick(): void {
    this.importShapes$.next();
  }

  private createShapesStream(): Observable<Shape[]> {
    // Create streams for handle creating/removing of shapes.
    // Merge this streams to avoid call subscribe myself.
    // This stream will not produce any data after handle request and response.
    const shapeChange$ = this.createAddShapeStream().pipe(
      merge(this.createRemoveShapeStream()),
      merge(this.createImportShapesStream()),
      switchMap(() => NEVER),
    );

    return this.category$.pipe(
      merge(shapeChange$),
      switchMap(category => {
        if (category == null) {
          return of(null);
        }
        return this.shapesService.getByCategory(category);
      }),
      publishReplay(1),
      refCount(),
    );
  }

  private createAddShapeStream(): Observable<Shape> {
    return this.createShape$.pipe(
      withLatestFrom(this.category$),
      switchMap(([, category]) => {
        const data: AddShapeDialogData = {
            categories: [category],
          };
        return this.dialogService.open(AddShapeDialogComponent, { data })
          .afterClosed();
      }),
      filter(dialogResult => dialogResult != null),
      map(shape => shape as Shape),
    );
  }

  private createRemoveShapeStream(): Observable<Shape> {
    return this.removeShape$.pipe(
      switchMap(shape => {
        const data: ConfirmDialogData = {
          message: 'Do you really want to delete a shape?',
        };
        const dialogRef = this.dialogService.open(ConfirmDialogComponent, { data });
        return dialogRef.afterClosed().pipe(
          filter(dialogResult => dialogResult as boolean),
          switchMap(() => this.shapesService.remove(shape)),
          mapTo(shape),
        );
      }),
    );
  }

  private createImportShapesStream(): Observable<Shape[]> {
    return this.importShapes$.pipe(
      withLatestFrom(this.category$),
      switchMap(([, category]) => {
        const data: ImportShapesDialogData = {
          categories: [category],
        };
        return this.dialogService.open(ImportShapesDialogComponent, { data })
          .afterClosed();
      }),
      filter(dialogResult => dialogResult != null),
      map(shapes => shapes as Shape[]),
    );
  }
}
