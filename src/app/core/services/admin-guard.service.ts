import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';

import { UserRole } from '../models/user-role';

import { UserService } from './user.service';

/**
 * Admin guard service.
 */
@Injectable()
export class AdminGuardService implements CanActivate {
  private userService: UserService;
  private router: Router;

  /**
   * .ctor
   * @param authService Authenticate service.
   * @param router Router.
   */
  public constructor(authService: UserService, router: Router) {
    this.userService = authService;
    this.router = router;
  }

  /**
   * @inheritDoc
   */
  public canActivate(): boolean {
    // Get user info
    if (this.userService.userRole === UserRole.Admin) {
      return true;
    }

    this.router.navigateByUrl('/access-denied');
    return false;
  }
}
