import { HttpClient, HttpContext, HttpParams } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { format, startOfDay } from "date-fns";
import * as t from "io-ts";
import { Observable, map, of, switchMap, throwError } from "rxjs";
import {
  TestResultGradeUpdate,
  TestResultPointsUpdate,
} from "src/app/events/services/test-state.service";
import { SETTINGS, Settings } from "src/app/settings";
import {
  AverageTestResultResponse,
  Course,
  CourseWithStudentCount,
  Grading,
  UpdatedTestResultResponse,
} from "../models/course.model";
import { Result } from "../models/test.model";
import { decode, decodeArray } from "../utils/decode";
import { hasRole } from "../utils/roles";
import { pick } from "../utils/types";
import { RestService } from "./rest.service";

@Injectable({
  providedIn: "root",
})
export class CoursesRestService extends RestService<typeof Course> {
  protected statusCodec = t.type(
    pick(this.codec.props, ["Id", "StatusId", "EvaluationStatusRef"]),
  );

  constructor() {
    const http = inject(HttpClient);
    const settings = inject<Settings>(SETTINGS);

    super(http, settings, Course, "Courses");
  }

  getNumberOfCoursesForRating(): Observable<number> {
    return this.http
      .get<
        unknown[]
      >(`${this.baseUrl}/?expand=EvaluationStatusRef&fields=Id,StatusId,EvaluationStatusRef&filter.StatusId=;10300;10240`, { headers: { "X-Role-Restriction": "TeacherRole" } })
      .pipe(
        switchMap(decodeArray(this.statusCodec)),
        map((courses) =>
          courses.filter(
            (course) =>
              course.EvaluationStatusRef.HasEvaluationStarted === true,
          ),
        ),
        map((ids) => ids.length),
      );
  }

  getExpandedCourses(roles: Maybe<string>): Observable<ReadonlyArray<Course>> {
    if (hasRole(roles, "TeacherRole")) {
      return this.http
        .get<
          unknown[]
        >(`${this.baseUrl}/?expand=EvaluationStatusRef,AttendanceRef,Classes,FinalGrades&filter.StatusId=;${this.settings.eventlist["statusfilter"]}`, { headers: { "X-Role-Restriction": "TeacherRole" } })
        .pipe(switchMap(decodeArray(Course)));
    }

    return of([]);
  }

  getExpandedCourse(courseId: number): Observable<Course> {
    return this.http
      .get<unknown>(
        `${this.baseUrl}/${courseId}?expand=ParticipatingStudents,EvaluationStatusRef,Tests,Gradings,FinalGrades,Classes`,
      )
      .pipe(switchMap(decode(Course)));
  }

  getExpandedCourseWithParticipants(courseId: number): Observable<Course> {
    return this.http
      .get<unknown>(
        `${this.baseUrl}/${courseId}?expand=Participants,Classes,AttendanceRef`,
      )
      .pipe(switchMap(decode(Course)));
  }

  getExpandedCoursesForDossier(): Observable<ReadonlyArray<Course>> {
    return this.http
      .get<unknown>(
        `${this.baseUrl}/?expand=Tests,Gradings,FinalGrades,EvaluationStatusRef,ParticipatingStudents,Classes&filter.StatusId=;${this.settings.eventlist["statusfilter"]}`,
      )
      .pipe(switchMap(decodeArray(Course)));
  }

  getExpandedCoursesForStudent(): Observable<ReadonlyArray<Course>> {
    return this.http
      .get<unknown>(
        `${this.baseUrl}/?expand=Tests,Gradings,FinalGrades&filter.StatusId=;${this.settings.eventlist["statusfilter"]}`,
        {
          headers: { "X-Role-Restriction": "StudentRole" },
        },
      )
      .pipe(switchMap(decodeArray(Course)));
  }

  getCourseWithStudentCount(
    courseId: number,
    options: { context?: HttpContext } = {},
  ): Observable<CourseWithStudentCount> {
    const params = new HttpParams()
      .set("fields", "Id,Designation,GradingScaleId")
      .set("expand", "Classes,AttendanceRef");
    return this.http
      .get<unknown>(`${this.baseUrl}/${courseId}`, { ...options, params })
      .pipe(switchMap(decode(CourseWithStudentCount)));
  }

  add(
    courseId: number,
    date: Date,
    designation: string,
    weight: number,
    isPointGrading: boolean,
    maxPoints: Maybe<number>,
    maxPointsAdjusted: Maybe<number>,
  ): Observable<void> {
    const body = {
      Tests: [
        {
          Date: format(startOfDay(date), "yyyy-MM-dd'T'HH:mm:ss"), // The backend cannot handle correct ISO date strings in UTC, so use a pseudo date string in local timezone
          Designation: designation,
          Weight: weight,
          IsPointGrading: isPointGrading,
          MaxPoints: maxPoints,
          MaxPointsAdjusted: maxPointsAdjusted,
        },
      ],
    };
    return this.http
      .put<void>(`${this.baseUrl}/${courseId}/Tests/New`, body)
      .pipe(map(() => undefined));
  }

  update(
    courseId: number,
    id: number,
    designation: string,
    date: Date,
    weight: number,
    isPointGrading: boolean,
    maxPoints: Maybe<number>,
    maxPointsAdjusted: Maybe<number>,
  ): Observable<void> {
    const body = {
      Tests: [
        {
          Id: id,
          Designation: designation,
          Date: format(startOfDay(date), "yyyy-MM-dd'T'HH:mm:ss"), // The backend cannot handle correct ISO date strings in UTC, so use a pseudo date string in local timezone
          Weight: weight,
          IsPointGrading: isPointGrading,
          MaxPoints: maxPoints,
          MaxPointsAdjusted: maxPointsAdjusted,
        },
      ],
    };
    return this.http
      .put<void>(`${this.baseUrl}/${courseId}/Tests/Update`, body)
      .pipe(map(() => undefined));
  }

  delete(courseId: number, testId: number): Observable<number> {
    const body = {
      TestIds: [testId],
    };
    return this.http
      .put<unknown>(`${this.baseUrl}/${courseId}/Tests/Delete`, body)
      .pipe(map(() => testId));
  }

  /**
   * Updates the corresponding test result with the new grade or points value.
   * It returns the updated test result and the affected grading. If the value
   * is set to `null` (i.e. the grade/points are removed), the returned test
   * result is `null` as well.
   */
  updateTestResult(
    courseId: number,
    update: TestResultGradeUpdate | TestResultPointsUpdate,
  ): Observable<{
    courseId: number;
    testResult: Option<Result>;
    grading: Grading;
  }> {
    // Although the endpoint would provide the possibility to update the
    // grades/points of multiple students, we expose only an API to update a
    // single test result (for the sake of simplicity).
    const { studentId, testId, ...rest } = update;
    const baseParams = { StudentIds: [studentId], TestId: testId };
    const params =
      "gradeId" in rest
        ? { ...baseParams, GradeId: rest.gradeId }
        : { ...baseParams, Points: rest.points };
    return this.http
      .put(`${this.baseUrl}/${courseId}/SetTestResult`, params)
      .pipe(
        switchMap(decode(UpdatedTestResultResponse)),
        switchMap(({ TestResults, Gradings }) => {
          if (TestResults.length <= 1 && Gradings.length === 1) {
            return of({
              courseId,
              testResult: TestResults[0] ?? null,
              grading: Gradings[0],
            });
          }
          return throwError(
            () =>
              new Error(
                "`TestResults` or `Gradings` does not contain a single value",
              ),
          );
        }),
      );
  }

  setAverageAsFinalGrade(body: {
    CourseIds: number[];
  }): Observable<AverageTestResultResponse> {
    return this.http
      .put(`${this.baseUrl}/SetAverageTestResult`, body)
      .pipe(switchMap(decode(AverageTestResultResponse)));
  }

  publishTest(id: number): Observable<number> {
    const body = { TestIds: [id] };
    return this.http
      .put(`${this.baseUrl}/PublishTest`, body)
      .pipe(map(() => id));
  }

  unpublishTest(id: number): Observable<number> {
    const body = { TestIds: [id] };
    return this.http
      .put(`${this.baseUrl}/UnpublishTest`, body)
      .pipe(map(() => id));
  }
}
