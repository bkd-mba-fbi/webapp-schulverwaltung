import { TestBed } from '@angular/core/testing';
import * as exp from 'constants';
import { of } from 'rxjs';
import { buildCourse, buildStudent } from 'src/spec-builders';
import { buildTestModuleMetadata } from 'src/spec-helpers';
import { Course } from '../models/course.model';
import { CoursesRestService } from './courses-rest.service';

import { DossierGradesService } from './dossier-grades.service';
import { LoadingService } from './loading-service';

describe('DossierGradesService', () => {
  let service: DossierGradesService;
  let coursesRestService: jasmine.SpyObj<CoursesRestService>;

  beforeEach(() => {
    coursesRestService = jasmine.createSpyObj('CoursesRestService', [
      'getExpandedCoursesForDossier',
    ]);
  });

  describe('studentCourses$', () => {
    it('should return empty list if there are no courses', () => {
      coursesRestService.getExpandedCoursesForDossier.and.returnValue(of([]));
      service = new DossierGradesService(
        coursesRestService,
        new LoadingService()
      );

      let result: Course[] = [];
      service.studentCourses$.subscribe((courses) => (result = courses));

      service.setStudentId(123);

      expect(result.length).toBe(0);
    });

    it('should return courses where the student participates', () => {
      const course1 = buildCourse(1);
      const course2 = buildCourse(2);
      const course3 = buildCourse(3);

      const student1 = buildStudent(11);
      const student2 = buildStudent(22);
      const student3 = buildStudent(33);

      course1.ParticipatingStudents = [student1, student2, student3];
      course2.ParticipatingStudents = [student2, student3];
      course3.ParticipatingStudents = [student1, student2];

      const courses = [course1, course2, course3];
      coursesRestService.getExpandedCoursesForDossier.and.returnValue(
        of(courses)
      );
      service = new DossierGradesService(
        coursesRestService,
        new LoadingService()
      );

      let result: Course[] = [];
      service.studentCourses$.subscribe((courses) => (result = courses));

      service.setStudentId(11);

      expect(result.length).toBe(2);
      expect(result).toContain(course1, course3);
    });
  });
});
