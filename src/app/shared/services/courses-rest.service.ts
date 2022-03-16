import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable, switchMap } from 'rxjs';
import { Settings, SETTINGS } from 'src/app/settings';
import { Course } from '../models/course.model';
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
}
