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

  describe('getFormativeAssessments', () => {
    it('should request the formative assessments with class teacher role', () => {
      service.getFormativeAssessments().subscribe((result) => {
        expect(result).toEqual([]);
      });

      httpTestingController
        .expectOne(
          (req) =>
            req.url ===
              'https://eventotest.api/StudyClasses/FormativeAssessments' &&
            req.headers.get('X-Role-Restriction') === 'ClassTeacherRole'
        )
        .flush([]);
    });
  });
});
