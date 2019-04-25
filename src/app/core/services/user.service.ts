import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import jwtDecode from 'jwt-decode';
import { BehaviorSubject } from 'rxjs';

import { UserRole } from '../models/user-role';

const STORAGE_TOKEN_ITEM_NAME = 'token';
const ROLE_CLAIM = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';
const ADMIN_ROLE_NAME = 'Administrator';

/**
 * User service.
 */
@Injectable()
export class UserService {
  private tokenValue: string;
  private userRoleValue: UserRole;

  /**
   * Is authorized change.
   */
  public isAutorizedChange = new BehaviorSubject<boolean>(false);

  /**
   * .ctor
   */
  public constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.restoreToken();
  }

  private restoreToken(): void {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem(STORAGE_TOKEN_ITEM_NAME);
      this.setToken(token);
    }
  }

  /**
   * Set auth token.
   * @param token Token.
   */
  public setToken(token?: string): void {
    if (!token) {
      // TODO: Check that token is not expired.
      this.tokenValue = null;
      this.userRoleValue = null;
      if (isPlatformBrowser(this.platformId)) {
        localStorage.removeItem(STORAGE_TOKEN_ITEM_NAME);
      }
      this.isAutorizedChange.next(false);
      return;
    }
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(STORAGE_TOKEN_ITEM_NAME, token);
    }
    // Decode token
    this.tokenValue = token;
    // Decode token
    const userInfo = jwtDecode(token);
    this.userRoleValue = this.getUserRoleByName(userInfo[ROLE_CLAIM]);
    this.isAutorizedChange.next(true);
  }

  /**
   * Reset auth token.
   */
  public resetToken(): void {
    this.setToken(null);
  }

  /**
   * Authentication token.
   */
  public get token(): string {
    return this.tokenValue;
  }

  /**
   * User role.
   */
  public get userRole(): UserRole {
    return this.userRoleValue;
  }

  private getUserRoleByName(userRoleName: string): UserRole {
    switch (userRoleName) {
      case ADMIN_ROLE_NAME:
        return UserRole.Admin;
    }

    return UserRole.Regular;
  }
}
