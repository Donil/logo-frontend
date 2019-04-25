import { HttpClient, HTTP_INTERCEPTORS, HttpRequest } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { AuthInterceptor } from './auth.interceptor';
import { UserService } from './user.service';

class MockUserService {
  public token: string;
}

const testUrl = 'test-url';
const testToken = '123456';

const interceptorsProviders = [
  {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true,
  },
];

describe('AuthInterceptor', () => {
  let httpTestingController: HttpTestingController;
  let httpClient: HttpClient;
  let userService: MockUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
      ],
      providers: [
        interceptorsProviders,
        { provide: UserService, useClass: MockUserService },
      ],
    });

    httpTestingController = TestBed.get(HttpTestingController);
    httpClient = TestBed.get(HttpClient);
    userService = TestBed.get(UserService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('Shound inject the Authorization header if token is not null', () => {
    userService.token = testToken;
    httpClient.get(testUrl)
      .subscribe();

    httpTestingController.expectOne((r: HttpRequest<any>) => {
      const authHeaderValue = r.headers.get('Authorization');
      return authHeaderValue && authHeaderValue === `Bearer ${testToken}`;
    });
  });

  it('Shound not inject the Authorization header if token is not null', () => {
    userService.token = null;
    httpClient.get(testUrl)
      .subscribe();

    httpTestingController.expectOne((r: HttpRequest<any>) => !r.headers.has('Authorization'));
  });
});
