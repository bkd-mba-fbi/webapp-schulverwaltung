import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { mapTo, Observable, switchMap, of } from 'rxjs';
import { Settings, SETTINGS } from 'src/app/settings';
import {
  Course,
  AverageTestResultResponse,
  TestGradesResult,
  TestPointsResult,
  UpdatedTestResultResponse,
} from '../models/course.model';
import { decode, decodeArray } from '../utils/decode';
import { RestService } from './rest.service';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class CoursesRestService extends RestService<typeof Course> {
  constructor(
    http: HttpClient,
    @Inject(SETTINGS) settings: Settings,
    private storage: StorageService
  ) {
    super(http, settings, Course, 'Courses');
  }

  getExpandedCourses(): Observable<ReadonlyArray<Course>> {
    const roleRestriction = 'TeacherRole';
    const roles = this.storage.getPayload()?.roles.split(';') || [];
    const commonRoles = roles.includes(roleRestriction);

    if (commonRoles) {
      return this.http
        .get<unknown[]>(
          `${this.baseUrl}/?expand=EvaluationStatusRef,AttendanceRef,Classes,FinalGrades&filter.StatusId=;${this.settings.eventlist.statusfilter}`,
          { headers: { 'X-Role-Restriction': roleRestriction } }
        )
        .pipe(switchMap(decodeArray(Course)));
    }

    return of([]);
  }

  getExpandedCourse(courseId: number): Observable<Course> {
    return this.http
      .get<unknown>(
        `${this.baseUrl}/${courseId}?expand=ParticipatingStudents,EvaluationStatusRef,Tests,Gradings,FinalGrades,Classes`
      )
      .pipe(switchMap(decode(Course)));
  }

  getExpandedCoursesForDossier(): Observable<ReadonlyArray<Course>> {
    return this.http
      .get<unknown>(
        `${this.baseUrl}/?expand=Tests,Gradings,FinalGrades,EvaluationStatusRef,ParticipatingStudents,Classes&filter.StatusId=;${this.settings.eventlist.statusfilter}`,
        { headers: { 'X-Role-Restriction': 'TeacherRole' } }
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
    maxPointsAdjusted: Maybe<number>
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
      .pipe(mapTo(undefined));
  }

  update(
    courseId: number,
    id: number,
    designation: string,
    date: Date,
    weight: number,
    isPointGrading: boolean,
    maxPoints: Maybe<number>,
    maxPointsAdjusted: Maybe<number>
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
      .pipe(mapTo(undefined));
  }

  delete(courseId: number, testId: number): Observable<number> {
    const body = {
      TestIds: [testId],
    };
    return this.http
      .put<unknown>(`${this.baseUrl}/${courseId}/Tests/Delete`, body)
      .pipe(mapTo(testId));
  }

  updateTestResult(
    courseId: number,
    body: TestPointsResult | TestGradesResult
  ): Observable<UpdatedTestResultResponse> {
    return this.http
      .put(`${this.baseUrl}/${courseId}/SetTestResult`, body)
      .pipe(switchMap(decode(UpdatedTestResultResponse)));
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
    return this.http.put(`${this.baseUrl}/PublishTest`, body).pipe(mapTo(id));
  }

  unpublishTest(id: number): Observable<number> {
    const body = { TestIds: [id] };
    return this.http.put(`${this.baseUrl}/UnpublishTest`, body).pipe(mapTo(id));
  }
}
