import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';

import { buildTestModuleMetadata } from 'src/spec-helpers';

describe('RestRoleInterceptor', () => {
  let http: HttpClient;
  let httpTestingController: HttpTestingController;
  let successCallback: jasmine.Spy;
  let errorCallback: jasmine.Spy;

  const mockRouter = { url: '' };

  beforeEach(() => {
    TestBed.configureTestingModule(
      buildTestModuleMetadata({
        providers: [{ provide: Router, useValue: mockRouter }],
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
    it('should not add header on root module', () => {
      mockRouter.url = '/';
      http.get('/').subscribe(successCallback, errorCallback);
      httpTestingController
        .expectOne(
          (req) =>
            req.url === '/' && req.headers.get('X-Role-Restriction') === null
        )
        .flush('hello', { status: 200, statusText: 'Success' });

      expect(successCallback).toHaveBeenCalledWith('hello');
      expect(errorCallback).not.toHaveBeenCalled();
    });

    it('should add header on presence control module', () => {
      mockRouter.url = '/presence-control';
      http.get('/presence-control').subscribe(successCallback, errorCallback);
      httpTestingController
        .expectOne(
          (req) =>
            req.url === '/presence-control' &&
            req.headers.get('X-Role-Restriction') === 'LessonTeacherRole'
        )
        .flush('hello', { status: 200, statusText: 'Success' });

      expect(successCallback).toHaveBeenCalledWith('hello');
      expect(errorCallback).not.toHaveBeenCalled();
    });

    it('should add header on my absences module', () => {
      mockRouter.url = '/my-absences';
      http.get('/my-absences').subscribe(successCallback, errorCallback);
      httpTestingController
        .expectOne(
          (req) =>
            req.url === '/my-absences' &&
            req.headers.get('X-Role-Restriction') === 'StudentRole'
        )
        .flush('hello', { status: 200, statusText: 'Success' });

      expect(successCallback).toHaveBeenCalledWith('hello');
      expect(errorCallback).not.toHaveBeenCalled();
    });

    it('should add header on open absences module', () => {
      mockRouter.url = '/open-absences';
      http.get('/open-absences').subscribe(successCallback, errorCallback);
      httpTestingController
        .expectOne(
          (req) =>
            req.url === '/open-absences' &&
            req.headers.get('X-Role-Restriction') ===
              'LessonTeacherRole;ClassTeacherRole'
        )
        .flush('hello', { status: 200, statusText: 'Success' });

      expect(successCallback).toHaveBeenCalledWith('hello');
      expect(errorCallback).not.toHaveBeenCalled();
    });

    it('should add header on edit absences module', () => {
      mockRouter.url = '/edit-absences';
      http.get('/edit-absences').subscribe(successCallback, errorCallback);
      httpTestingController
        .expectOne(
          (req) =>
            req.url === '/edit-absences' &&
            req.headers.get('X-Role-Restriction') ===
              'LessonTeacherRole;ClassTeacherRole'
        )
        .flush('hello', { status: 200, statusText: 'Success' });

      expect(successCallback).toHaveBeenCalledWith('hello');
      expect(errorCallback).not.toHaveBeenCalled();
    });

    it('should not add header on evaluate absences module', () => {
      mockRouter.url = '/evaluate-absences';
      http.get('/evaluate-absences').subscribe(successCallback, errorCallback);
      httpTestingController
        .expectOne(
          (req) =>
            req.url === '/evaluate-absences' &&
            req.headers.get('X-Role-Restriction') === null
        )
        .flush('hello', { status: 200, statusText: 'Success' });

      expect(successCallback).toHaveBeenCalledWith('hello');
      expect(errorCallback).not.toHaveBeenCalled();
    });

    it('should not add header on my profile module', () => {
      mockRouter.url = '/my-profile';
      http.get('/my-profile').subscribe(successCallback, errorCallback);
      httpTestingController
        .expectOne(
          (req) =>
            req.url === '/my-profile' &&
            req.headers.get('X-Role-Restriction') === null
        )
        .flush('hello', { status: 200, statusText: 'Success' });

      expect(successCallback).toHaveBeenCalledWith('hello');
      expect(errorCallback).not.toHaveBeenCalled();
    });
  });
});
