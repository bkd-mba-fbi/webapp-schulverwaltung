import { TestBed } from "@angular/core/testing";
import { of } from "rxjs";
import {
  buildCourse,
  buildGradingScale,
  buildResult,
  buildStudent,
  buildTest,
} from "src/spec-builders";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { Course, FinalGrading, Grading } from "../models/course.model";
import { CoursesRestService } from "./courses-rest.service";
import { DossierGradesService } from "./dossier-grades.service";
import { StorageService } from "./storage.service";
import { Grade } from "../models/grading-scale.model";

describe("DossierGradesService", () => {
  let service: DossierGradesService;
  let coursesRestService: jasmine.SpyObj<CoursesRestService>;

  beforeEach(() => {
    coursesRestService = jasmine.createSpyObj("CoursesRestService", [
      "getExpandedCoursesForDossier",
    ]);

    TestBed.configureTestingModule(
      buildTestModuleMetadata({
        providers: [
          DossierGradesService,
          { provide: CoursesRestService, useValue: coursesRestService },
          {
            provide: StorageService,
            useValue: jasmine.createSpyObj("StorageService", ["getPayload"]),
          },
        ],
      }),
    );
    service = TestBed.inject(DossierGradesService);
  });

  describe("studentCourses$", () => {
    it("should return empty list if there are no courses", () => {
      coursesRestService.getExpandedCoursesForDossier.and.returnValue(of([]));

      let result: Course[] = [];
      service.studentCourses$.subscribe((courses) => (result = courses));

      service.setStudentId(123);

      expect(result.length).toBe(0);
    });

    it("should return courses where the student participates", () => {
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
        of(courses),
      );

      let result: Course[] = [];
      service.studentCourses$.subscribe((courses) => (result = courses));

      service.setStudentId(11);

      expect(result.length).toBe(2);
      expect(result).toContain(course1);
      expect(result).toContain(course3);
    });
  });

  describe("get gradings for the given student", () => {
    let course: Course;

    const expectedFinalGrading: FinalGrading = {
      StudentId: 3,
      Grade: "5.0",
    } as unknown as FinalGrading;

    const finalGrades = [
      { StudentId: 1, Grade: "4.5" } as unknown as FinalGrading,
      { StudentId: 2, Grade: "4.0" } as unknown as FinalGrading,
      expectedFinalGrading,
    ];

    const expectedGrading: Grading = {
      StudentId: 44,
    } as unknown as Grading;
    const gradings: Grading[] = [
      { StudentId: 33 } as unknown as Grading,
      { StudentId: 55 } as unknown as Grading,
      expectedGrading,
    ];

    beforeEach(() => {
      course = {
        FinalGrades: finalGrades,
        Gradings: gradings,
      } as unknown as Course;
    });

    it("should not find a final grade if studentid does not match", () => {
      const studentId = -1;

      expect(
        service.getFinalGradeForStudent(course, studentId),
      ).toBeUndefined();
    });

    it("should not find a grading if studentid does not match", () => {
      const studentId = -1;

      expect(service.getGradingForStudent(course, studentId)).toBeUndefined();
    });

    it("should get final grade for current student", () => {
      const studentId = expectedFinalGrading.StudentId;

      expect(service.getFinalGradeForStudent(course, studentId)).toEqual(
        expectedFinalGrading,
      );
    });

    it("should get the grading for the current student", () => {
      const studentId = expectedGrading.StudentId;

      expect(service.getGradingForStudent(course, studentId)).toEqual(
        expectedGrading,
      );
    });
  });

  describe("getGradesForStudent", () => {
    it("should return an array with student grades", () => {
      const gradingScales = [
        buildGradingScale(1106, [
          { Designation: 5.5, Id: 2349 } as unknown as Grade,
          { Designation: 5, Id: 2348 } as unknown as Grade,
        ]),
      ];
      const course = buildCourse(333);
      course.Tests = [
        buildTest(course.Id, 1, [buildResult(1, 1234)]),
        {
          ...buildTest(course.Id, 2, [
            { ...buildResult(2, 1234), GradeId: 2348 },
          ]),
          Weight: 0.5,
        },
        buildTest(course.Id, 3, [buildResult(3, 999)]),
        buildTest(course.Id, 4, null),
      ];

      expect(service.getGradesForStudent(course, 1234, gradingScales)).toEqual([
        { value: 5.5, weight: 2 },
        { value: 5, weight: 0.5 },
      ]);
    });
  });
});
