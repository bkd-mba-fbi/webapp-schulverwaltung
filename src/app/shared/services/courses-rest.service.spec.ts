import { HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { buildTestModuleMetadata } from 'src/spec-helpers';

import { CoursesRestService } from './courses-rest.service';
import { buildCourse } from '../../../spec-builders';

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
      const data: any[] = [];

      service.getExpandedCourses().subscribe((result) => {
        expect(result).toEqual(data);
      });

      httpTestingController
        .expectOne(
          (req) =>
            req.url ===
            'https://eventotest.api/Courses/?expand=EvaluationStatusRef,AttendanceRef,Classes'
        )
        .flush(data);
    });
  });

  xdescribe('getExpandedCourse', () => {
    const id = 9248;
    const mockCourse = buildCourse(id);
    it('should request a single course by ID expanding ParticipatingStudents, EvaluationStatusRef, Tests, Gradings, FinalGrades', () => {
      service.getExpandedCourse(id).subscribe((result) => {
        expect(result).toEqual(mockCourse);
      });

      httpTestingController
        .expectOne(
          (req) =>
            req.url ===
            `https://eventotest.api/Courses/${id}?expand=ParticipatingStudents,EvaluationStatusRef,Tests,Gradings,FinalGrades`
        )
        .flush(mockCourse);
    });
  });
});
