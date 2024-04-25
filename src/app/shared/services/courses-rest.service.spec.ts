import { HttpTestingController } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { isEqual } from "lodash-es";
import {
  TestResultGradeUpdate,
  TestResultPointsUpdate,
} from "src/app/events/services/test-state.service";
import { buildTestModuleMetadata } from "src/spec-helpers";
import {
  buildCourse,
  buildGrading,
  buildReference,
  buildResult,
} from "../../../spec-builders";
import {
  AverageTestResultResponse,
  Course,
  Grading,
  UpdatedTestResultResponse,
} from "../models/course.model";
import { Result } from "../models/test.model";
import { CoursesRestService } from "./courses-rest.service";

/* eslint-disable @typescript-eslint/no-explicit-any */

describe("CoursesRestService", () => {
  let service: CoursesRestService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule(buildTestModuleMetadata({}));
    service = TestBed.inject(CoursesRestService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpTestingController.verify());

  describe("getNumberOfCoursesForRating", () => {
    it("should return the number of courses where the evaluation has started", () => {
      const ratingStarted = {
        ...buildCourse(1001, "Course with HasEvaluationStarted true"),
        EvaluationStatusRef: {
          ...buildReference(),
          HasEvaluationStarted: true,
        },
      };
      const ratingNotStarted = {
        ...buildCourse(1002, "Course with HasEvaluationStarted false"),
        EvaluationStatusRef: {
          ...buildReference(),
          HasEvaluationStarted: false,
        },
      };

      service.getNumberOfCoursesForRating().subscribe((result) => {
        expect(result).toEqual(1);
      });
      httpTestingController
        .expectOne(
          (req) =>
            req.urlWithParams ===
              "https://eventotest.api/Courses/?expand=EvaluationStatusRef&fields=Id,StatusId,EvaluationStatusRef&filter.StatusId=;10300;10240" &&
            req.headers.get("X-Role-Restriction") === "TeacherRole",
        )
        .flush([ratingNotStarted, ratingStarted]);
    });
  });

  describe("getExpandedCourses", () => {
    it("should request all courses expanding EvaluationStatusRef, AttendanceRef and Classes fields if roles contain TeacherRole", () => {
      const data: any[] = [];
      const roles = "TeacherRole";

      service.getExpandedCourses(roles).subscribe((result) => {
        expect(result).toEqual(data);
      });

      httpTestingController
        .expectOne(
          (req) =>
            req.url ===
              "https://eventotest.api/Courses/?expand=EvaluationStatusRef,AttendanceRef,Classes,FinalGrades&filter.StatusId=;14030;14025;14017;14020;10350;10335;10355;10315;10330;1032510320;10340;10345;10230;10225;10240;10260;10217;10235;10220;10226;10227;10250;10300" &&
            req.headers.get("X-Role-Restriction") === "TeacherRole",
        )
        .flush(data);
    });

    it("should not send request and return empty list if roles do not contain TeacherRole", () => {
      const data: any[] = [];
      const roles = "ClassTeacherRole";

      service.getExpandedCourses(roles).subscribe((result) => {
        expect(result).toEqual(data);
      });

      httpTestingController.expectNone(
        (req) =>
          req.url ===
            "https://eventotest.api/Courses/?expand=EvaluationStatusRef,AttendanceRef,Classes,FinalGrades&filter.StatusId=;14030;14025;14017;14020;10350;10335;10355;10315;10330;1032510320;10340;10345;10230;10225;10240;10260;10217;10235;10220;10226;10227;10250;10300" &&
          req.headers.get("X-Role-Restriction") === "TeacherRole",
      );
    });

    it("should request a single course by ID expanding ParticipatingStudents, EvaluationStatusRef, Tests, Gradings, FinalGrades, Classes", () => {
      const id = 9248;
      const mockCourse = buildCourse(id);
      service.getExpandedCourse(id).subscribe((result) => {
        expect(result).toEqual(mockCourse);
      });

      httpTestingController
        .expectOne(
          (req) =>
            req.url ===
            `https://eventotest.api/Courses/${id}?expand=ParticipatingStudents,EvaluationStatusRef,Tests,Gradings,FinalGrades,Classes`,
        )
        .flush(Course.encode(mockCourse));
    });

    it("should request all courses for Dossier, expanding Tests, Gradings, FinalGrades and EvaluationStatusRef, Classes and ParticipatingStudents", () => {
      const data: any[] = [];

      service.getExpandedCoursesForDossier().subscribe((result) => {
        expect(result).toEqual(data);
      });

      httpTestingController
        .expectOne(
          (req) =>
            req.url ===
            "https://eventotest.api/Courses/?expand=Tests,Gradings,FinalGrades,EvaluationStatusRef,ParticipatingStudents,Classes&filter.StatusId=;14030;14025;14017;14020;10350;10335;10355;10315;10330;1032510320;10340;10345;10230;10225;10240;10260;10217;10235;10220;10226;10227;10250;10300",
        )
        .flush(data);
    });
  });

  describe("manage tests", () => {
    let course: Course;
    let expectedResult: {
      courseId: number;
      testResult: Result;
      grading: Grading;
    };

    beforeEach(() => {
      course = buildCourse(1);
      const testResult = buildResult(123, 20);
      expectedResult = {
        courseId: course.Id,
        testResult,
        grading: buildGrading(testResult.StudentId),
      };
    });

    it("should add a new test", () => {
      const courseId = 1234;

      service
        .add(
          courseId,
          new Date("2022-02-09T00:00:00"),
          "designation",
          33,
          false,
          44,
          55,
        )
        .subscribe();

      httpTestingController.match(
        (req) =>
          req.method === "PUT" &&
          req.url === `https://eventotest.api/Courses/${courseId}/Tests/New` &&
          isEqual(req.body, {
            Tests: [
              {
                Date: new Date("2022-02-09T00:00:00"),
                Designation: "designation",
                Weight: 33,
                IsPointGrading: false,
                MaxPoints: 44,
                MaxPointsAdjusted: 55,
              },
            ],
          }),
      );

      expect().nothing();
    });

    it("should update an existing test", () => {
      const courseId = 1234;
      const testId = 4321;

      service
        .update(
          courseId,
          testId,
          "updated designation",
          new Date("2022-02-09T00:00:00"),
          33,
          false,
          null,
          null,
        )
        .subscribe();

      httpTestingController.match(
        (req) =>
          req.method === "PUT" &&
          req.url ===
            `https://eventotest.api/Courses/${courseId}/Tests/Update` &&
          isEqual(req.body, {
            Tests: [
              {
                Id: testId,
                Designation: "updated designation",
                Date: new Date("2022-02-09T00:00:00"),
                Weight: 33,
                IsPointGrading: false,
                MaxPoints: null,
                MaxPointsAdjusted: null,
              },
            ],
          }),
      );

      expect().nothing();
    });

    it("should delete an existing test", () => {
      const courseId = 1234;
      const testId = 4321;

      service.delete(courseId, testId).subscribe((response) => {
        expect(response).toBe(testId);
      });

      httpTestingController
        .expectOne(
          (req) =>
            req.method === "PUT" &&
            req.url ===
              `https://eventotest.api/Courses/${courseId}/Tests/Delete` &&
            isEqual(req.body, {
              TestIds: [testId],
            }),
        )
        .flush(testId);
    });

    it("should publish a test", () => {
      // given
      const testId = 123;

      // when
      service
        .publishTest(testId)
        .subscribe((result) => expect(result).toEqual(testId));

      // then
      httpTestingController
        .expectOne(
          ({ method, url, body }) =>
            method === "PUT" &&
            url === `https://eventotest.api/Courses/PublishTest` &&
            isEqual(body, {
              TestIds: [testId],
            }),
        )
        .flush(testId);
    });

    it("should unpublish a test", () => {
      // given
      const testId = 123;

      // when
      service
        .unpublishTest(testId)
        .subscribe((result) => expect(result).toEqual(testId));

      // then
      httpTestingController
        .expectOne(
          ({ method, url, body }) =>
            method === "PUT" &&
            url === `https://eventotest.api/Courses/UnpublishTest` &&
            isEqual(body, {
              TestIds: [testId],
            }),
        )
        .flush(testId);
    });

    it("should update the result of a test with points", () => {
      // given
      const params: TestResultPointsUpdate = {
        studentId: 20,
        testId: 123,
        points: 10,
      };

      // when
      updateTestResult(params, expectedResult);

      // then
      assertRequestAndFlush(
        {
          StudentIds: [params.studentId],
          TestId: params.testId,
          Points: params.points,
        },
        {
          TestResults: [expectedResult.testResult],
          Gradings: [expectedResult.grading],
        },
      );
    });

    it("should update the result of a test with the gradingScale", () => {
      // given
      const params: TestResultGradeUpdate = {
        studentId: 20,
        testId: 123,
        gradeId: 5,
      };

      // when
      updateTestResult(params, expectedResult);

      // then
      assertRequestAndFlush(
        {
          StudentIds: [params.studentId],
          TestId: params.testId,
          GradeId: params.gradeId,
        },
        {
          TestResults: [expectedResult.testResult],
          Gradings: [expectedResult.grading],
        },
      );
    });
  });

  describe("manage grades", () => {
    const averageTestResultResponse: AverageTestResultResponse = {
      Gradings: [],
    };

    it("PUT: SetAverageTestResult, should set student average as final grade", () => {
      const requestBody = { CourseIds: [1234] };

      service.setAverageAsFinalGrade(requestBody).subscribe((result) => {
        expect(result).toEqual(averageTestResultResponse);
      });

      httpTestingController
        .expectOne(
          ({ method, url, body }) =>
            method === "PUT" &&
            url === "https://eventotest.api/Courses/SetAverageTestResult" &&
            isEqual(body, requestBody),
        )
        .flush(averageTestResultResponse);
    });
  });

  function updateTestResult(
    requestBody: TestResultGradeUpdate | TestResultPointsUpdate,
    expectedResponse: {
      courseId: number;
      testResult: Option<Result>;
      grading: Grading;
    },
  ) {
    service
      .updateTestResult(expectedResponse.courseId, requestBody)
      .subscribe((result) => expect(result).toEqual(expectedResponse));
  }

  function assertRequestAndFlush(
    requestBody: {
      StudentIds: ReadonlyArray<number>;
      TestId: number;
      GradeId?: Option<number>;
      Points?: Option<number>;
    },
    responseBody: UpdatedTestResultResponse,
  ) {
    httpTestingController
      .expectOne(
        ({ method, url, body }) =>
          method === "PUT" &&
          url === `https://eventotest.api/Courses/1/SetTestResult` &&
          isEqual(body, requestBody),
      )
      .flush(responseBody);
  }
});
