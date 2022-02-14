import { HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { buildTestModuleMetadata } from 'src/spec-helpers';

import { CoursesRestService } from './courses-rest.service';

describe('CoursesRestService', () => {
  let service: CoursesRestService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule(buildTestModuleMetadata({}));
    service = TestBed.inject(CoursesRestService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  describe('getExpandedCourses', () => {
    it('should request all courses expanding EvaluationStatusRef, AttendanceRef and Classes fields', () => {
      service.getExpandedCourses().subscribe((result) => {
        expect(result).toEqual([]);
      });

      httpTestingController
        .expectOne(
          (req) =>
            req.url ===
            'https://eventotest.api/Courses/?expand=EvaluationStatusRef,AttendanceRef,Classes'
        )
        .flush([]);
    });
  });
});
