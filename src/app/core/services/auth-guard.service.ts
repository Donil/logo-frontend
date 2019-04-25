import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { UserService } from './user.service';

/**
 * Authentication guard.
 */
@Injectable()
export class AuthGuardService implements CanActivate {
  /**
   * .ctor
   */
  public constructor(
    protected userService: UserService,
    protected router: Router) {
  }

  /**
   * @inheritDoc
   */
  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.userService.isAutorizedChange
      .pipe(
        map(isAuthorized => {
          if (!isAuthorized) {
            const redirectUrl = state.url;
            this.router.navigate(['/login', redirectUrl]);
          }
          return isAuthorized;
        })
      );
  }
}
