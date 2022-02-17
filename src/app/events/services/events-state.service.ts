import { Inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Settings, SETTINGS } from 'src/app/settings';
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
  detailLink: string;
  dateFrom?: Date;
  dateTo?: Date;
  studentCount: number;
  state: Option<EventState>;
  evaluationLink: Option<string>;
}
@Injectable()
export class EventsStateService {
  loading$ = this.loadingService.loading$;

  events$ = this.loadingService.load(this.loadEvents());

  constructor(
    private coursesRestService: CoursesRestService,
    private studyClassRestService: StudyClassesRestService,
    private loadingService: LoadingService,
    private storage: StorageService,
    @Inject(SETTINGS) private settings: Settings
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
          .pipe(map(this.createFromStudyClasses.bind(this)))
      : this.coursesRestService
          .getExpandedCourses()
          .pipe(map(this.createFromCourses.bind(this)));
  }

  createFromStudyClasses(
    studyClasses: ReadonlyArray<StudyClass>
  ): ReadonlyArray<Event> {
    return studyClasses.map((studyClass) => ({
      id: studyClass.Id,
      designation: studyClass.Designation,
      detailLink: this.getLink(studyClass, 'eventdetail'),
      studentCount: studyClass.StudentCount,
      state: EventState.Rating,
      evaluationLink: this.getLink(studyClass, 'evaluation'),
    }));
  }

  createFromCourses(courses: ReadonlyArray<Course>): ReadonlyArray<Event> {
    return courses.map((course) => {
      const state = this.getState(course);

      return {
        id: course.Id,
        designation: this.getDesignation(course),
        detailLink: this.getLink(course, 'eventdetail'),
        studentCount: course.AttendanceRef.StudentCount || 0,
        dateFrom: course.DateFrom,
        dateTo: course.DateTo,
        state: state,
        evaluationLink: this.getEvaluationLink(course, state),
      };
    });
  }

  getDesignation(course: Course): string {
    const classes = course.Classes
      ? course.Classes.map((c) => c.Designation).join(', ')
      : null;

    return classes ? course.Designation + ', ' + classes : course.Designation;
  }

  getState(course: Course): Option<EventState> {
    const courseStatus = course.EvaluationStatusRef;

    if (courseStatus.HasTestGrading === true) {
      return EventState.Tests;
    }

    if (courseStatus.HasEvaluationStarted === true) {
      if (courseStatus.EvaluationUntil == null) {
        return EventState.IntermediateRating;
      }

      if (courseStatus.EvaluationUntil >= new Date()) {
        return EventState.RatingUntil;
      }
    }

    return null;
  }

  getEvaluationLink(course: Course, state: Option<EventState>): Option<string> {
    return state === null || state === EventState.Tests
      ? null
      : this.getLink(course, 'evaluation');
  }

  getLink(event: StudyClass | Course, linkTo: string): string {
    return `${this.settings.eventlist[linkTo]}=${event.Id}`;
  }
}
