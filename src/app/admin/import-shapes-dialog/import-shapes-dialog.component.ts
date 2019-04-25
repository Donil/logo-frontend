import { Component, Inject, ChangeDetectionStrategy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { Category } from '../../core/models/category';
import { Shape } from '../../core/models/shape';

import { ImportShapesDialogData } from './import-shapes-dialog-data';
export { ImportShapesDialogData} from './import-shapes-dialog-data';

/**
 * Import shapes dialog component.
 */
@Component({
  selector: 'ad-import-shapes-dialog',
  templateUrl: './import-shapes-dialog.component.html',
  styleUrls: [
    './import-shapes-dialog.component.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImportShapesDialogComponent {
  /**
   * .ctor
   * @param dialogRef Dialog reference.
   * @param data Dialog data.
   */
  public constructor(
    private dialogRef: MatDialogRef<ImportShapesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data: ImportShapesDialogData) {
    this.categories = data.categories;
  }

  /**
   * Categories of imported shapes.
   */
  public categories: Category[];

  /**
   * Close dialog.
   * @param shapes Result shapes.
   */
  public onImported(shapes: Shape[]): void {
    this.dialogRef.close(shapes);
  }
}
