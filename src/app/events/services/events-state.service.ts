import { Injectable } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { Course } from 'src/app/shared/models/course.model';
import { StudyClass } from 'src/app/shared/models/study-class.model';
import { CoursesRestService } from 'src/app/shared/services/courses-rest.service';
import { LoadingService } from 'src/app/shared/services/loading-service';
import { StorageService } from 'src/app/shared/services/storage.service';
import { StudyClassesRestService } from 'src/app/shared/services/study-classes-rest.service';

export enum EventState {
  Rating = 'rating',
  RatingUntil = 'rating-until',
  IntermediateRating = 'intermediate-rating',
  Tests = 'add-tests',
}
export interface Event {
  id: number;
  designation: string;
  dateFrom?: Date;
  dateTo?: Date;
  studentCount: number;
  state: EventState;
  link: string;
}
@Injectable()
export class EventsStateService {
  loading$ = this.loadingService.loading$;

  events$ = this.loadingService.load(this.loadEvents());

  constructor(
    private coursesRestService: CoursesRestService,
    private studyClassRestService: StudyClassesRestService,
    private loadingService: LoadingService,
    private storage: StorageService
  ) {}

  /**
   * Depending on the current user's roles the events are derived either from courses or study classes
   */
  loadEvents(): Observable<ReadonlyArray<Event>> {
    const tokenPayload = this.storage.getPayload();
    const hasRoleClassTeacher = tokenPayload
      ? tokenPayload.roles.indexOf('ClassTeacherRole') > 0
      : false;

    return hasRoleClassTeacher
      ? this.studyClassRestService
          .getFormativeAssessments()
          .pipe(map(this.mapStudyClassesToEvents.bind(this)))
      : this.coursesRestService
          .getExpandedCourses()
          .pipe(map(this.mapCoursesToEvents.bind(this)));
  }

  mapStudyClassesToEvents(
    studyClasses: ReadonlyArray<StudyClass>
  ): ReadonlyArray<Event> {
    return studyClasses.map((studyClass) => ({
      id: studyClass.Id,
      designation: studyClass.Designation,
      studentCount: studyClass.StudentCount,
      state: EventState.Rating,
      link: 'settings.eventlist.Evaluation', // TODO
    }));
  }

  mapCoursesToEvents(courses: ReadonlyArray<Course>): ReadonlyArray<Event> {
    return courses.map((course) => ({
      id: course.Id,
      designation:
        course.Designation +
        (course.Classes
          ? ', ' + course.Classes.map((c) => c.Designation).join(', ')
          : ''),
      studentCount: course.AttendanceRef.StudentCount || 0,
      dateFrom: course.DateFrom,
      dateTo: course.DateTo,
      state: EventState.Tests, // TODO or other states
      link: 'settings.eventlist.Evaluation', // TODO or to module tests
    }));
  }
}
