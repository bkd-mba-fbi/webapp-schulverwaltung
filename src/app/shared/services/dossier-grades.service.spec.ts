import { TestBed } from "@angular/core/testing";
import { of } from "rxjs";
import {
  buildCourse,
  buildGradingScale,
  buildResult,
  buildSubscription,
  buildTest,
} from "src/spec-builders";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { Course, FinalGrading, Grading } from "../models/course.model";
import { CoursesRestService } from "./courses-rest.service";
import { DossierGradesService } from "./dossier-grades.service";
import { ReportsService } from "./reports.service";
import { StorageService } from "./storage.service";
import { SubscriptionsRestService } from "./subscriptions-rest.service";

describe("DossierGradesService", () => {
  let service: DossierGradesService;
  let coursesRestService: jasmine.SpyObj<CoursesRestService>;
  let subscriptionsRestService: jasmine.SpyObj<SubscriptionsRestService>;
  let reportsService: jasmine.SpyObj<ReportsService>;

  beforeEach(() => {
    coursesRestService = jasmine.createSpyObj("CoursesRestService", [
      "getExpandedCoursesForDossier",
    ]);

    subscriptionsRestService = jasmine.createSpyObj(
      "SubscriptionsRestService",
      ["getSubscriptionsByStudent"],
    );

    reportsService = jasmine.createSpyObj("ReportsService", [
      "getTeacherSubscriptionGradesReports",
    ]);

    TestBed.configureTestingModule(
      buildTestModuleMetadata({
        providers: [
          DossierGradesService,
          { provide: CoursesRestService, useValue: coursesRestService },
          {
            provide: SubscriptionsRestService,
            useValue: subscriptionsRestService,
          },
          { provide: ReportsService, useValue: reportsService },
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
    it("returns empty list if there are no subscriptions/courses", () => {
      subscriptionsRestService.getSubscriptionsByStudent.and.returnValue(
        of([]),
      );
      coursesRestService.getExpandedCoursesForDossier.and.returnValue(of([]));

      let result: Course[] = [];
      service.studentCourses$.subscribe((courses) => (result = [...courses]));

      service.setStudentId(123);

      expect(result.length).toBe(0);
    });

    it("returns courses if the student has subscriptions", () => {
      const course1 = buildCourse(1);
      const course2 = buildCourse(2);
      const course3 = buildCourse(3);
      const subscription1 = buildSubscription(1, course1.Id, 123);
      const subscription2 = buildSubscription(2, course2.Id, 123);
      const subscription3 = buildSubscription(3, course3.Id, 123);

      subscriptionsRestService.getSubscriptionsByStudent.and.returnValue(
        of([subscription1, subscription2, subscription3]),
      );
      coursesRestService.getExpandedCoursesForDossier.and.returnValue(
        of([course1, course2, course3]),
      );

      let result: Course[] = [];
      service.studentCourses$.subscribe((courses) => (result = [...courses]));

      service.setStudentId(123);

      expect(result).toEqual([course1, course2, course3]);
      expect(
        subscriptionsRestService.getSubscriptionsByStudent,
      ).toHaveBeenCalledWith(123);
      expect(
        coursesRestService.getExpandedCoursesForDossier,
      ).toHaveBeenCalledWith([course1.Id, course2.Id, course3.Id]);
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

    it("should not find a final grade if student ID does not match", () => {
      const studentId = -1;

      expect(
        service.getFinalGradeForStudent(course, studentId),
      ).toBeUndefined();
    });

    it("should not find a grading if student ID does not match", () => {
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
          {
            Designation: "5.5",
            Value: 5.5,
            Id: 2349,
            Sort: "10",
            Sufficient: true,
          },
          {
            Designation: "5",
            Value: 5.0,
            Id: 2348,
            Sort: "11",
            Sufficient: true,
          },
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

  describe("load test reports", () => {
    it("does not load the test reports if the student has no subscriptions", () => {
      subscriptionsRestService.getSubscriptionsByStudent.and.returnValue(
        of([]),
      );

      service.testReports$.subscribe();
      service.setStudentId(123);

      expect(
        reportsService.getTeacherSubscriptionGradesReports,
      ).not.toHaveBeenCalled();
    });

    it("loads the test reports if the student has subscriptions", () => {
      const course = buildCourse(1);
      const subscription = buildSubscription(1, course.Id, 123);

      subscriptionsRestService.getSubscriptionsByStudent.and.returnValue(
        of([subscription]),
      );

      service.testReports$.subscribe();
      service.setStudentId(123);

      expect(
        subscriptionsRestService.getSubscriptionsByStudent,
      ).toHaveBeenCalledWith(123);
      expect(
        reportsService.getTeacherSubscriptionGradesReports,
      ).toHaveBeenCalledWith([subscription.Id]);
    });
  });
});
