import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MatDialogRef } from '@angular/material';

/**
 * Selected shape dialog component.
 */
@Component({
  selector: 'cl-select-shape-dialog',
  templateUrl: './select-shape-dialog.component.html',
  styleUrls: [
    './select-shape-dialog.component.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectShapeDialogComponent {
  /**
   * .ctor
   */
  public constructor() {
  }
}
