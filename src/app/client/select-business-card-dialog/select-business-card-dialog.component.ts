import { Component, ChangeDetectionStrategy } from '@angular/core';

/**
 * Select business card dialog component.
 */
@Component({
  selector: 'cl-select-business-card-dialog',
  templateUrl: './select-business-card-dialog.component.html',
  styleUrls: [
    './select-business-card-dialog.component.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectBusinessCardDialogComponent {
  /**
   * .ctor
   */
  public constructor() {
  }
}
