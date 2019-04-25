import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AuthDto } from './dto/auth-dto';
import { AuthResponseDto } from './dto/auth-response-dto';
import { ProvidersConfig } from './providers-config';
import { UserService } from './user.service';

/**
 * Authenticate service.
 */
@Injectable()
export class AuthService {
  private readonly authEndpoint;

  /**
   * .ctor
   */
  public constructor(
    config: ProvidersConfig,
    private http: HttpClient,
    private userService: UserService) {
    this.authEndpoint = `${config.apiRootEndpoint}/api/auth`;
  }

  /**
   * Login.
   * @param login Login.
   * @param password Password.
   */
  public login(login: string, password: string): Observable<void> {
    const body: AuthDto = {
      email: login,
      password: password,
    };

    return this.http.post<AuthResponseDto>(this.authEndpoint, body)
      .pipe(
        map(response => this.userService.setToken(response.token)),
      );
  }
}
