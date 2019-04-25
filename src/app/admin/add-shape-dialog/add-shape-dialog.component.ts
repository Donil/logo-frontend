import { Component, Inject, ChangeDetectionStrategy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { Category } from '../../core/models/category';
import { Shape } from '../../core/models/shape';

import { AddShapeDialogData } from './add-shape-dialog-data';
export { AddShapeDialogData } from './add-shape-dialog-data';

/**
 * Add shape dialog component.
 */
@Component({
  selector: 'ad-add-shape-dialog',
  templateUrl: './add-shape-dialog.component.html',
  styleUrls: [
    './add-shape-dialog.component.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddShapeDialogComponent {
  /**
   * .ctor
   * @param dialogRef Dialog reference.
   * @param data Dialog data.
   */
  public constructor(
    private dialogRef: MatDialogRef<AddShapeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: AddShapeDialogData,
  ) {
    this.categories = data.categories;
  }

  /**
   * Categoies for adding shapes.
   */
  public categories: Category[];

  /**
   * On shape added.
   * @param shape Added shape.
   */
  public onShapeAdded(shape: Shape): void {
    this.dialogRef.close(shape);
  }
}
