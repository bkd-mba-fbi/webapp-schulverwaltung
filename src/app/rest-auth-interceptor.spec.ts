import { TestBed } from '@angular/core/testing';
import { HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpTestingController } from '@angular/common/http/testing';

import { buildTestModuleMetadata } from 'src/spec-helpers';
import { AuthService } from './shared/services/auth.service';
import { SETTINGS } from './settings';
import { RestAuthInterceptor } from './rest-auth-interceptor';

describe('RestAuthInterceptor', () => {
  let http: HttpClient;
  let httpTestingController: HttpTestingController;
  let authServiceMock: AuthService;
  let successCallback: jasmine.Spy;
  let errorCallback: jasmine.Spy;

  beforeEach(() => {
    TestBed.configureTestingModule(
      buildTestModuleMetadata({
        providers: [
          {
            provide: HTTP_INTERCEPTORS,
            useClass: RestAuthInterceptor,
            multi: true
          },
          {
            provide: AuthService,
            useValue: {
              isAuthenticated: true,
              accessToken: 'abcdefghijklmnopqrstuvwxyz'
            }
          },
          { provide: SETTINGS, useValue: { apiUrl: '/api' } }
        ]
      })
    );

    http = TestBed.get(HttpClient);
    httpTestingController = TestBed.get(HttpTestingController);
    authServiceMock = TestBed.get(AuthService);

    successCallback = jasmine.createSpy('success');
    errorCallback = jasmine.createSpy('error');
  });

  describe('.intercept', () => {
    describe('authenticated', () => {
      it('adds CLX-Authorization header to request for API requests', () => {
        http.get('/api').subscribe(successCallback, errorCallback);
        httpTestingController
          .expectOne(
            req =>
              req.url === '/api' &&
              req.headers.get('CLX-Authorization') ===
                'token_type=urn:ietf:params:oauth:token-type:jwt-bearer, access_token=abcdefghijklmnopqrstuvwxyz'
          )
          .flush('hello', { status: 200, statusText: 'Success' });

        expect(successCallback).toHaveBeenCalledWith('hello');
        expect(errorCallback).not.toHaveBeenCalled();
      });

      it('does not add CLX-Authorization header to request for non-API requests', () => {
        http
          .get('http://example.com')
          .subscribe(successCallback, errorCallback);
        httpTestingController
          .expectOne(
            req =>
              req.url === 'http://example.com' &&
              !req.headers.has('CLX-Authorization')
          )
          .flush('hello', { status: 200, statusText: 'Success' });

        expect(successCallback).toHaveBeenCalledWith('hello');
        expect(errorCallback).not.toHaveBeenCalled();
      });
    });

    describe('unauthenticated', () => {
      beforeEach(() => {
        (authServiceMock as any).isAuthenticated = false;
        (authServiceMock as any).accessToken = null;
      });

      it('does not add CLX-Authorization header to request', () => {
        http.get('/api').subscribe(successCallback, errorCallback);
        httpTestingController
          .expectOne(
            req => req.url === '/api' && !req.headers.has('CLX-Authorization')
          )
          .flush('hello', { status: 200, statusText: 'Success' });

        expect(successCallback).toHaveBeenCalledWith('hello');
        expect(errorCallback).not.toHaveBeenCalled();
      });
    });
  });
});
