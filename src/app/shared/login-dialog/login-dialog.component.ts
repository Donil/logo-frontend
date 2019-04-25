import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';

/**
 * Login dialog component.
 */
@Component({
  selector: 'app-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.scss'],
})
export class LoginDialogComponent {
  /**
   * .ctor
   * @param dialogRef Dialog reference.
   */
  public constructor(private dialogRef: MatDialogRef<LoginDialogComponent>) {
  }
}
