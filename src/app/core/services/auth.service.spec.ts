import { HttpResponse, HttpErrorResponse, HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';
import { ProvidersConfig } from './providers-config';
import { UserService } from './user.service';

class UserServiceSpy {
  public setToken = jasmine.createSpy('setToken');
}

const token = '123456';
const login = 'login';
const password = 'password';
const loginUrl = '/api/auth';
const providersConfig = { apiRootEndpoint: '' };

describe('AuthService', () => {
  let httpTestingController: HttpTestingController;
  let authService: AuthService;
  let userService: UserServiceSpy;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
      ],
      providers: [
        AuthService,
        { provide: UserService, useClass: UserServiceSpy },
        { provide: ProvidersConfig, useValue: providersConfig },
      ],
    });

    httpTestingController = TestBed.get(HttpTestingController);
    authService = TestBed.get(AuthService);
    userService = TestBed.get(UserService);
  });

  afterEach(() => {
    // After every test, assert that there are no more pending requests.
    httpTestingController.verify();
  });

  it('Successful login should set token', () => {
    authService.login(login, password)
      .subscribe();

    // Prepare request
    const req = httpTestingController.expectOne(loginUrl);
    expect(req.request.method).toBe('POST');
    req.flush({ token });

    expect(userService.setToken).toHaveBeenCalledWith(token);
  });

  it('Login sould send correct data', () => {
    authService.login(login, password)
      .subscribe();

    const req = httpTestingController.expectOne(loginUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body.email).toBe(login);
    expect(req.request.body.password).toBe(password);

    req.flush({ token });
  });

  it('Failed login should throw error', () => {
    const errorMessage = 'Wrong login or password';
    authService.login(login, password)
      .subscribe(
        () => fail('Should have failed with error'),
        (error: HttpErrorResponse) => {
          expect(error.status).toBe(404);
          expect(error.error).toBe(errorMessage);
        }
      );

    const req = httpTestingController.expectOne(loginUrl);
    expect(req.request.method).toBe('POST');

    req.flush(errorMessage, { status: 404, statusText: 'Not Found' });
  });
});
