import { Inject, Injectable } from '@angular/core';
import { combineLatest, map, Observable } from 'rxjs';
import { Settings, SETTINGS } from 'src/app/settings';
import { Course } from 'src/app/shared/models/course.model';
import { StudyClass } from 'src/app/shared/models/study-class.model';
import { CoursesRestService } from 'src/app/shared/services/courses-rest.service';
import { LoadingService } from 'src/app/shared/services/loading-service';
import { StorageService } from 'src/app/shared/services/storage.service';
import { StudyClassesRestService } from 'src/app/shared/services/study-classes-rest.service';
import { spread } from 'src/app/shared/utils/function';

export enum EventState {
  Rating = 'rating',
  RatingUntil = 'rating-until',
  IntermediateRating = 'intermediate-rating',
  Tests = 'add-tests',
}

type LinkType = 'evaluation' | 'eventdetail';
export interface Event {
  id: number;
  designation: string;
  detailLink: string;
  dateFrom?: Date;
  dateTo?: Date;
  studentCount: number;
  state: Option<EventState>;
  ratingUntil?: Option<Date>;
  evaluationLink: Option<string>;
}
@Injectable()
export class EventsStateService {
  loading$ = this.loadingService.loading$;

  courses$ = this.coursesRestService.getExpandedCourses();
  studyClasses$ = this.studyClassRestService.getFormativeAssessments();

  events$ = this.loadEvents();

  constructor(
    private coursesRestService: CoursesRestService,
    private studyClassRestService: StudyClassesRestService,
    private loadingService: LoadingService,
    private storage: StorageService,
    @Inject(SETTINGS) private settings: Settings
  ) {}

  /**
   * Events are derived either from courses or study classes.
   * If the current user has the role 'ClassTeacherRole', an additional request to get study classes is made.
   */
  loadEvents(): Observable<ReadonlyArray<Event>> {
    return this.loadingService.load(
      this.hasClassTeacherRole()
        ? combineLatest([this.courses$, this.studyClasses$]).pipe(
            map(spread(this.createAndSortEvents.bind(this)))
          )
        : this.courses$.pipe(map((course) => this.createAndSortEvents(course)))
    );
  }

  private createAndSortEvents(
    courses: ReadonlyArray<Course>,
    studyClasses: ReadonlyArray<StudyClass> = []
  ): ReadonlyArray<Event> {
    return [
      ...this.createFromCourses(courses),
      ...this.createFromStudyClasses(studyClasses),
    ].sort((a, b) => a.designation.localeCompare(b.designation));
  }

  private createFromStudyClasses(
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

  private createFromCourses(
    courses: ReadonlyArray<Course>
  ): ReadonlyArray<Event> {
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
        ratingUntil: course.EvaluationStatusRef.EvaluationUntil,
        evaluationLink: this.getEvaluationLink(course, state),
      };
    });
  }

  private getDesignation(course: Course): string {
    const classes = course.Classes
      ? course.Classes.map((c) => c.Designation).join(', ')
      : null;

    return classes ? course.Designation + ', ' + classes : course.Designation;
  }

  private getState(course: Course): Option<EventState> {
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

  private getEvaluationLink(
    course: Course,
    state: Option<EventState>
  ): Option<string> {
    return state === null || state === EventState.Tests
      ? null
      : this.getLink(course, 'evaluation');
  }

  private getLink(event: StudyClass | Course, linkType: LinkType): string {
    return `${this.settings.eventlist[linkType]}=${event.Id}`;
  }

  private hasClassTeacherRole(): boolean {
    const tokenPayload = this.storage.getPayload();
    return tokenPayload
      ? tokenPayload.roles.indexOf('ClassTeacherRole') >= 0
      : false;
  }
}
