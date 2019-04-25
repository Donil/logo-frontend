import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { UserRole } from '../models/user-role';

import { AdminGuardService } from './admin-guard.service';
import { UserService } from './user.service';

class MockUserService {
  public userRole: UserRole;
}

class MockRouter {
  public navigateByUrl = jasmine.createSpy('navigateByUrl');
}

describe('AdminGuardService', () => {
  let routerSpy: MockRouter;
  let adminGuardService: AdminGuardService;
  let userService: MockUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AdminGuardService,
        { provide: UserService, useClass: MockUserService },
        { provide: Router, useClass: MockRouter },
      ],
    });

    userService = TestBed.get(UserService);
    routerSpy = TestBed.get(Router);
    adminGuardService = TestBed.get(AdminGuardService);
  });

  it('Should return true for user with admin role', () => {
    userService.userRole = UserRole.Admin;
    const canActivate = adminGuardService.canActivate();
    expect(canActivate).toBeTruthy();
  });

  it('Should not navigate to access denied page for user with admin role', () => {
    userService.userRole = UserRole.Admin;
    adminGuardService.canActivate();
    expect(routerSpy.navigateByUrl).not.toHaveBeenCalled();
  });

  it('Should return false for user with admin role', () => {
    userService.userRole = UserRole.Regular;
    const canActivate = adminGuardService.canActivate();
    expect(canActivate).toBeFalsy();
  });

  it('Should navigate to access denied page for not admin user', () => {
    userService.userRole = UserRole.Regular;
    adminGuardService.canActivate();
    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/access-denied');
  });
});
