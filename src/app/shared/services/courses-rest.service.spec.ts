import { HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { buildTestModuleMetadata } from 'src/spec-helpers';

import { CoursesRestService } from './courses-rest.service';
import { buildCourse } from '../../../spec-builders';
import { Course } from '../models/course.model';

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
              'https://eventotest.api/Courses/?expand=EvaluationStatusRef,AttendanceRef,Classes&filter.StatusId=;14030;14025;14017;14020;10350;10335;10355;10315;10330;1032510320;10340;10345;10230;10225;10240;10260;10217;10235;10220;10226;10227;10250;10300' &&
            req.headers.get('X-Role-Restriction') === 'TeacherRole'
        )
        .flush(data);

      httpTestingController.verify();
    });
  });

  describe('getExpandedCourse', () => {
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
        .flush(Course.encode(mockCourse));

      httpTestingController.verify();
    });
  });
});
