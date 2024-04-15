import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import * as t from "io-ts";
import { Observable, map, of, switchMap } from "rxjs";
import { SETTINGS, Settings } from "src/app/settings";
import {
  AverageTestResultResponse,
  Course,
  TestGradesResult,
  TestPointsResult,
  UpdatedTestResultResponse,
} from "../models/course.model";
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

  constructor(http: HttpClient, @Inject(SETTINGS) settings: Settings) {
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
        >(`${this.baseUrl}/?expand=EvaluationStatusRef,AttendanceRef,Classes,FinalGrades&filter.StatusId=;${this.settings.eventlist.statusfilter}`, { headers: { "X-Role-Restriction": "TeacherRole" } })
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

  getExpandedCoursesForDossier(): Observable<ReadonlyArray<Course>> {
    return this.http
      .get<unknown>(
        `${this.baseUrl}/?expand=Tests,Gradings,FinalGrades,EvaluationStatusRef,ParticipatingStudents,Classes&filter.StatusId=;${this.settings.eventlist.statusfilter}`,
      )
      .pipe(switchMap(decodeArray(Course)));
  }

  getExpandedCoursesForStudent(): Observable<ReadonlyArray<Course>> {
    return this.http
      .get<unknown>(
        `${this.baseUrl}/?expand=Tests,Gradings,FinalGrades&filter.StatusId=;${this.settings.eventlist.statusfilter}`,
        {
          headers: { "X-Role-Restriction": "StudentRole" },
        },
      )
      .pipe(switchMap(decodeArray(Course)));
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
          Date: date,
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
          Date: date,
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

  updateTestResult(
    courseId: number,
    body: TestPointsResult | TestGradesResult,
  ): Observable<{ courseId: number; body: UpdatedTestResultResponse }> {
    return this.http
      .put(`${this.baseUrl}/${courseId}/SetTestResult`, body)
      .pipe(
        switchMap(decode(UpdatedTestResultResponse)),
        switchMap((value) => of({ courseId, body: value })),
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
