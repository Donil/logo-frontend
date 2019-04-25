import { TestBed, async } from '@angular/core/testing';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

import { AuthGuardService } from './auth-guard.service';
import { UserService } from './user.service';

const REDIRECT_URL_AFTER_LOGIN = 'REDIRECT_URL_AFTER_LOGIN';

class MockUserService {
  public isAutorizedChange = new BehaviorSubject<boolean>(false);
}

class RouterSpy {
  public navigate = jasmine.createSpy('navigate');
}

describe('AuthGuardService', () => {
  let authGuardService: AuthGuardService;
  let routerSpy: RouterSpy;
  let userService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthGuardService,
        { provide: UserService, useClass: MockUserService },
        { provide: Router, useClass: RouterSpy },
      ],
    });

    authGuardService = TestBed.get(AuthGuardService);
    routerSpy = TestBed.get(Router);
    userService = TestBed.get(UserService);
  });

  it('Should return true for authenticated user', async(() => {
    userService.isAutorizedChange.next(true);
    const route: ActivatedRouteSnapshot = {} as ActivatedRouteSnapshot;
    const state: RouterStateSnapshot = {
      url: REDIRECT_URL_AFTER_LOGIN,
      root: null,
    };
    authGuardService.canActivate(route, state)
      .subscribe(canActivate => expect(canActivate).toBe(true));
  }));

  it('Should return false for not authenticated user', async(() => {
    userService.isAutorizedChange.next(false);
    const route: ActivatedRouteSnapshot = {} as ActivatedRouteSnapshot;
    const state: RouterStateSnapshot = {
      url: REDIRECT_URL_AFTER_LOGIN,
      root: null,
    };
    authGuardService.canActivate(route, state)
      .subscribe(canActivate => {
        expect(canActivate).toBe(false);
      });
  }));

  it('Should navigate to login page for not authenticated user', async(() => {
    userService.isAutorizedChange.next(false);
    const route: ActivatedRouteSnapshot = {} as ActivatedRouteSnapshot;
    const state: RouterStateSnapshot = {
      url: REDIRECT_URL_AFTER_LOGIN,
      root: null,
    };
    authGuardService.canActivate(route, state)
      .subscribe(() => expect(routerSpy.navigate).toHaveBeenCalled());
  }));
});
