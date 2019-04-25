import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { ConfirmDialogData } from './confirm-dialog-data';

const DEFAULT_CONFIRM_BUTTON_TEXT = 'Yes';
const DEFAULT_REJECT_BUTTON_TEXT = 'No';
const DEFAULT_TITLE_TEXT = 'Confirm';

// Reexport.
export { ConfirmDialogData } from './confirm-dialog-data';

/**
 * Confirm dialog component.
 */
@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: [
    './confirm-dialog.component.scss',
  ],
})
export class ConfirmDialogComponent {
  /**
   * .ctor
   * @param dialogRef Dialog reference.
   * @param data Dialog data.
   */
  public constructor(
    private dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: ConfirmDialogData
  ) {
    this.confirmButtonText = data.confimButtonText || DEFAULT_CONFIRM_BUTTON_TEXT;
    this.rejectButtonText = data.rejectButtonText || DEFAULT_REJECT_BUTTON_TEXT;
    this.title = data.title || DEFAULT_TITLE_TEXT;
    this.message = data.message;
  }

  /**
   * Confirm button text.
   */
  public confirmButtonText: string;

  /**
   * Reject button text.
   */
  public rejectButtonText: string;

  /**
   * Message.
   */
  public message: string;

  /**
   * Title.
   */
  public title: string;
}
