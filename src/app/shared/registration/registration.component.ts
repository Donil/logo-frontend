import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

import { AuthService } from '../../core/services/auth.service';

/**
 * Registration component,
 */
@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: [
    './registration.component.scss',
  ],
})
export class RegistrationComponent {
  /**
   * .ctor
   * @param authService Auth service.
   */
  public constructor(private authService: AuthService) {
  }

  /**
   * Is busy.
   */
  public isBusy = false;

  /**
   * On form submit.
   * @param form Form.
   */
  public onFormSubmit(form: NgForm): void {

  }
}
