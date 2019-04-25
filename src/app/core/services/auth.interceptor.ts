import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { UserService } from './user.service';

/**
 * Authentication http interceptor.
 */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  public constructor(private userService: UserService) {

  }

  /**
   * @inheritDoc
   */
  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.userService.token) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${this.userService.token}`,
        },
      });
    }
    return next.handle(req)
      .pipe(
        catchError((error: any) => this.handleError(error))
      );
  }

  private handleError(error: any): Observable<never> {
    // TODO: Handle HTTP errors.
    return throwError(error);
  }
}
