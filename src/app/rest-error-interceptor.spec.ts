import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';

import { withConfig } from './rest-error-interceptor';
import { buildTestModuleMetadata } from 'src/spec-helpers';
import { ToastService } from './shared/services/toast.service';

describe('RestErrorInterceptor', () => {
  let http: HttpClient;
  let httpTestingController: HttpTestingController;
  let routerMock: Router;
  let toastServiceMock: ToastService;
  let successCallback: jasmine.Spy;
  let errorCallback: jasmine.Spy;

  beforeEach(() => {
    routerMock = jasmine.createSpyObj('Router', ['navigate']);
    toastServiceMock = jasmine.createSpyObj('ToastService', ['error']);

    TestBed.configureTestingModule(
      buildTestModuleMetadata({
        providers: [
          { provide: Router, useValue: routerMock },
          {
            provide: ToastService,
            useValue: toastServiceMock,
          },
        ],
      })
    );

    http = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);

    successCallback = jasmine.createSpy('success');
    errorCallback = jasmine.createSpy('error');
  });

  describe('.intercept', () => {
    afterEach(() => {
      httpTestingController.verify();
    });
    it('does nothing if request is successful', () => {
      http.get('/').subscribe(successCallback, errorCallback);
      httpTestingController
        .expectOne('/')
        .flush('hello', { status: 200, statusText: 'Success' });

      expect(successCallback).toHaveBeenCalledWith('hello');
      expect(errorCallback).not.toHaveBeenCalled();
      expect(routerMock.navigate).not.toHaveBeenCalled();
      expectNoToast();
    });

    it('catches unknown error and displays notification', () => {
      http.get('/').subscribe(successCallback, errorCallback);
      httpTestingController
        .expectOne('/')
        .flush('hello', { status: 0, statusText: 'Unknown' });

      expect(successCallback).not.toHaveBeenCalled();
      expect(errorCallback).not.toHaveBeenCalled();
      expect(routerMock.navigate).not.toHaveBeenCalled();
      expectToast('unavailable');
    });

    it('catches unauthorized error and displays notification', () => {
      http.get('/').subscribe(successCallback, errorCallback);
      httpTestingController
        .expectOne('/')
        .flush('hello', { status: 401, statusText: 'Unauthorized' });

      expect(successCallback).not.toHaveBeenCalled();
      expect(errorCallback).not.toHaveBeenCalled();
      expect(routerMock.navigate).toHaveBeenCalledWith(['/unauthenticated']);
      expectToast('noaccess');
    });

    it('catches forbidden error and displays notification', () => {
      http.get('/').subscribe(successCallback, errorCallback);
      httpTestingController
        .expectOne('/')
        .flush('hello', { status: 403, statusText: 'Forbidden' });

      expect(successCallback).not.toHaveBeenCalled();
      expect(errorCallback).not.toHaveBeenCalled();
      expect(routerMock.navigate).not.toHaveBeenCalled();
      expectToast('noaccess');
    });

    it('catches not found error and displays notification', () => {
      http.get('/').subscribe(successCallback, errorCallback);
      httpTestingController
        .expectOne('/')
        .flush('hello', { status: 404, statusText: 'Not found' });

      expect(successCallback).not.toHaveBeenCalled();
      expect(errorCallback).not.toHaveBeenCalled();
      expect(routerMock.navigate).not.toHaveBeenCalled();
      expectToast('notfound');
    });

    it('catches service unavailable error and displays notification', () => {
      http.get('/').subscribe(successCallback, errorCallback);
      httpTestingController
        .expectOne('/')
        .flush('hello', { status: 503, statusText: 'Service unavailable' });

      expect(successCallback).not.toHaveBeenCalled();
      expect(errorCallback).not.toHaveBeenCalled();
      expect(routerMock.navigate).not.toHaveBeenCalled();
      expectToast('unavailable');
    });

    it('catches gateway timeout error and displays notification', () => {
      http.get('/').subscribe(successCallback, errorCallback);
      httpTestingController
        .expectOne('/')
        .flush('hello', { status: 504, statusText: 'Gateway timeout' });

      expect(successCallback).not.toHaveBeenCalled();
      expect(errorCallback).not.toHaveBeenCalled();
      expect(routerMock.navigate).not.toHaveBeenCalled();
      expectToast('unavailable');
    });

    it('catches server error and displays notification', () => {
      http.get('/').subscribe(successCallback, errorCallback);
      httpTestingController
        .expectOne('/')
        .flush('hello', { status: 500, statusText: 'Internal server error' });

      expect(successCallback).not.toHaveBeenCalled();
      expect(errorCallback).not.toHaveBeenCalled();
      expect(routerMock.navigate).not.toHaveBeenCalled();
      expectToast('server');
    });

    it('catches conflict error and displays notification', () => {
      http.get('/').subscribe(successCallback, errorCallback);
      httpTestingController
        .expectOne('/')
        .flush('hello', { status: 409, statusText: 'Conflict' });

      expect(successCallback).not.toHaveBeenCalled();
      expect(errorCallback).not.toHaveBeenCalled();
      expect(routerMock.navigate).not.toHaveBeenCalled();
      expectToast('conflict');
    });

    it("oh lovely, let's have a cup of tea, shall we?", () => {
      http.get('/').subscribe(successCallback, errorCallback);
      httpTestingController
        .expectOne('/')
        .flush('hello', { status: 418, statusText: "I'm a teapot" });

      expect(successCallback).not.toHaveBeenCalled();
      expect(errorCallback).not.toHaveBeenCalled();
      expect(routerMock.navigate).not.toHaveBeenCalled();
      expectToast('server');
    });

    it('allows to disable error handling for "all" codes', () => {
      const params = withConfig({ disableErrorHandling: true });
      http.get('/', { params }).subscribe(successCallback, errorCallback);
      httpTestingController
        .expectOne('/')
        .flush('hello', { status: 502, statusText: 'Bad Gateway' });

      expect(successCallback).not.toHaveBeenCalled();
      expect(errorCallback).toHaveBeenCalled();
      expect(routerMock.navigate).not.toHaveBeenCalled();
      expectNoToast();
    });

    it('allows to disable error handling for certain status codes', () => {
      const params = withConfig({ disableErrorHandlingForStatus: [403, 404] });
      http.get('/', { params }).subscribe(successCallback, errorCallback);
      httpTestingController
        .expectOne('/')
        .flush('hello', { status: 403, statusText: 'Forbidden' });

      expect(successCallback).not.toHaveBeenCalled();
      expect(errorCallback).toHaveBeenCalled();
      expect(routerMock.navigate).not.toHaveBeenCalled();
      expectNoToast();
    });

    it('handles non-skipped errors codes', () => {
      const params = withConfig({ disableErrorHandlingForStatus: [403, 404] });
      http.get('/', { params }).subscribe(successCallback, errorCallback);
      httpTestingController
        .expectOne('/')
        .flush('hello', { status: 500, statusText: 'Internal server error' });

      expect(successCallback).not.toHaveBeenCalled();
      expect(errorCallback).not.toHaveBeenCalled();
      expect(routerMock.navigate).not.toHaveBeenCalled();
      expectToast('server');
    });

    function expectNoToast(): void {
      expect(toastServiceMock.error).not.toHaveBeenCalled();
    }

    function expectToast(messageKey: string): void {
      expect(toastServiceMock.error).toHaveBeenCalledWith(
        `global.rest-errors.${messageKey}-message`,
        `global.rest-errors.${messageKey}-title`
      );
    }
  });
});
