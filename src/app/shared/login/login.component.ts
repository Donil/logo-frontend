import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AuthService } from '../../core/services/auth.service';

/**
 * Login component.
 */
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: [
    './login.component.scss',
  ],
})
export class LoginComponent implements OnInit {
  private returnUrl: string;

  /**
   * .ctor
   * @param authService Auth service.
   * @param router Router.
   * @param route Route.
   */
  public constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute) {
  }

  /**
   * Login.
   */
  public login: string;

  /**
   * Password.
   */
  public password: string;

  /**
   * Is busy.
   */
  public isBusy = false;

  /**
   * Error message.
   */
  public errorMessage: string = null;

  /**
   * @inheritDoc
   */
  public ngOnInit(): void {
    this.returnUrl = this.route.snapshot.params['returnUrl'];
  }

  /**
   * On form submit.
   */
  public onSubmit(): void {
    this.isBusy = true;

    this.authService.login(this.login, this.password)
      .subscribe(() => {
        this.isBusy = false;
        if (this.returnUrl) {
          this.router.navigateByUrl(this.returnUrl);
        }
      }, () => this.isBusy = false);
  }
}
