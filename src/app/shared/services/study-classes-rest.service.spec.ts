import { HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { buildTestModuleMetadata } from 'src/spec-helpers';
import { StudyClassesRestService } from './study-classes-rest.service';

describe('StudyClassesRestService', () => {
  let service: StudyClassesRestService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule(buildTestModuleMetadata({}));
    service = TestBed.inject(StudyClassesRestService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  describe('getFormativeAssessments', () => {
    it('should request the active formative assessments for role class teacher', () => {
      service.getActiveFormativeAssessments().subscribe((result) => {
        expect(result).toEqual([]);
      });

      httpTestingController
        .expectOne(
          (req) =>
            req.url ===
              'https://eventotest.api/StudyClasses/FormativeAssessments?filter.IsActive==true' &&
            req.headers.get('X-Role-Restriction') === 'ClassTeacherRole',
        )
        .flush([]);
    });
  });

  describe('getActive', () => {
    it('should request the the active study classes for role class teacher', () => {
      service.getActive().subscribe((result) => {
        expect(result).toEqual([]);
      });

      httpTestingController
        .expectOne(
          (req) =>
            req.url ===
              'https://eventotest.api/StudyClasses/?filter.IsActive==true' &&
            req.headers.get('X-Role-Restriction') === 'ClassTeacherRole',
        )
        .flush([]);
    });
  });
});
