import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { mapTo, Observable, switchMap } from 'rxjs';
import { Settings, SETTINGS } from 'src/app/settings';
import {
  Course,
  TestGradesResult,
  TestPointsResult,
  UpdatedTestResultResponse,
} from '../models/course.model';
import { decode, decodeArray } from '../utils/decode';
import { RestService } from './rest.service';

@Injectable({
  providedIn: 'root',
})
export class CoursesRestService extends RestService<typeof Course> {
  constructor(http: HttpClient, @Inject(SETTINGS) settings: Settings) {
    super(http, settings, Course, 'Courses');
  }

  getExpandedCourses(): Observable<ReadonlyArray<Course>> {
    return this.http
      .get<unknown[]>(
        `${this.baseUrl}/?expand=EvaluationStatusRef,AttendanceRef,Classes&filter.StatusId=;${this.settings.eventlist.statusfilter}`,
        { headers: { 'X-Role-Restriction': 'TeacherRole' } }
      )
      .pipe(switchMap(decodeArray(Course)));
  }

  getExpandedCourse(courseId: number): Observable<Course> {
    return this.http
      .get<unknown>(
        `${this.baseUrl}/${courseId}?expand=ParticipatingStudents,EvaluationStatusRef,Tests,Gradings,FinalGrades`
      )
      .pipe(switchMap(decode(Course)));
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

  delete(courseId: number, testId: number): Observable<void> {
    const body = {
      TestIds: [testId],
    };
    return this.http
      .put<void>(`${this.baseUrl}/${courseId}/Tests/Delete`, body)
      .pipe(mapTo(undefined));
  }

  updateTestResult(
    course: Course,
    body: TestPointsResult | TestGradesResult
  ): Observable<UpdatedTestResultResponse> {
    return this.http
      .put(`${this.baseUrl}/${course.Id}/SetTestResult`, body)
      .pipe(switchMap(decode(UpdatedTestResultResponse)));
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
