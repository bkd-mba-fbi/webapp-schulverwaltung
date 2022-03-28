import { Inject, Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { format } from 'date-fns';
import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';
import { Settings, SETTINGS } from 'src/app/settings';
import { Course } from 'src/app/shared/models/course.model';
import { StudyClass } from 'src/app/shared/models/study-class.model';
import { CoursesRestService } from 'src/app/shared/services/courses-rest.service';
import { LoadingService } from 'src/app/shared/services/loading-service';
import { StorageService } from 'src/app/shared/services/storage.service';
import { StudyClassesRestService } from 'src/app/shared/services/study-classes-rest.service';
import { spread } from 'src/app/shared/utils/function';
import { searchEntries } from 'src/app/shared/utils/search';

export enum EventState {
  Rating = 'rating',
  RatingUntil = 'rating-until',
  IntermediateRating = 'intermediate-rating',
  Tests = 'add-tests',
}

type LinkType = 'evaluation' | 'eventdetail';
export interface Event {
  id: number;
  Designation: string;
  detailLink: string;
  dateFrom?: Option<Date>;
  dateTo?: Option<Date>;
  studentCount: number;
  state: Option<EventState>;
  evaluationText?: string;
  evaluationLink?: Option<string>;
}
@Injectable()
export class EventsStateService {
  loading$ = this.loadingService.loading$;
  search$ = new BehaviorSubject<string>('');

  private courses$ = this.coursesRestService.getExpandedCourses();
  private formativeAssessments$ = this.studyClassRestService.getActiveFormativeAssessments();
  private studyClasses$ = this.studyClassRestService.getActive();

  private events$ = this.loadEvents();
  filteredEvents$ = combineLatest([this.events$, this.search$]).pipe(
    map(spread(searchEntries))
  );

  constructor(
    private coursesRestService: CoursesRestService,
    private studyClassRestService: StudyClassesRestService,
    private loadingService: LoadingService,
    private storage: StorageService,
    private translate: TranslateService,
    @Inject(SETTINGS) private settings: Settings
  ) {}

  /**
   * Events are derived either from courses or study classes.
   * If the current user has the role 'ClassTeacherRole', additional requests to get study classes/formative assessments are made.
   */
  loadEvents(): Observable<ReadonlyArray<Event>> {
    return this.loadingService.load(
      this.hasClassTeacherRole()
        ? combineLatest([
            this.courses$,
            this.formativeAssessments$,
            this.studyClasses$,
          ]).pipe(map(spread(this.createAndSortEvents.bind(this))))
        : this.courses$.pipe(map((course) => this.createAndSortEvents(course)))
    );
  }

  private createAndSortEvents(
    courses: ReadonlyArray<Course>,
    formativeAssessments: ReadonlyArray<StudyClass> = [],
    studyClasses: ReadonlyArray<StudyClass> = []
  ): ReadonlyArray<Event> {
    const classesWithoutAssessments = studyClasses.filter(
      (c) => !formativeAssessments.map((fa) => fa.Id).includes(c.Id)
    );
    return [
      ...this.createFromCourses(courses),
      ...this.createFromAssessments(formativeAssessments),
      ...this.createFromStudyClasses(classesWithoutAssessments),
    ].sort((a, b) => a.Designation.localeCompare(b.Designation));
  }

  private createFromStudyClasses(
    studyClasses: ReadonlyArray<StudyClass>
  ): ReadonlyArray<Event> {
    return studyClasses.map((studyClass) => ({
      id: studyClass.Id,
      Designation: studyClass.Number,
      detailLink: this.buildLink(studyClass.Id, 'eventdetail'),
      studentCount: studyClass.StudentCount,
      state: null,
    }));
  }

  private createFromAssessments(
    studyClasses: ReadonlyArray<StudyClass>
  ): ReadonlyArray<Event> {
    const events = this.createFromStudyClasses(studyClasses);

    return events.map((e) => ({
      ...e,
      state: EventState.Rating,
      evaluationText: this.translate.instant('events.state.rating'),
      evaluationLink: this.buildLink(e.id, 'evaluation'),
    }));
  }

  private createFromCourses(
    courses: ReadonlyArray<Course>
  ): ReadonlyArray<Event> {
    return courses.map((course) => {
      const state = this.getState(course);

      return {
        id: course.Id,
        Designation: this.getDesignation(course),
        detailLink: this.buildLink(course.Id, 'eventdetail'),
        studentCount: course.AttendanceRef.StudentCount || 0,
        dateFrom: course.DateFrom,
        dateTo: course.DateTo,
        state: state,
        evaluationText: this.getEvaluationText(
          state,
          course.EvaluationStatusRef.EvaluationUntil
        ),
        evaluationLink: this.getEvaluationLink(course, state),
      };
    });
  }

  private getDesignation(course: Course): string {
    const classes = course.Classes
      ? course.Classes.map((c) => c.Number).join(', ')
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

  private getEvaluationText(
    state: Option<EventState>,
    date?: Maybe<Date>
  ): string {
    return state === null
      ? ''
      : this.translate.instant(`events.state.${state}`) +
          (state === EventState.RatingUntil
            ? ` ${date ? format(date, 'dd.MM.yyyy') : ''}`
            : '');
  }

  private getEvaluationLink(
    course: Course,
    state: Option<EventState>
  ): Option<string> {
    return state === null || state === EventState.Tests
      ? null
      : this.buildLink(course.Id, 'evaluation');
  }

  private buildLink(id: number, linkType: LinkType): string {
    return `${this.settings.eventlist[linkType]}=${id}`;
  }

  private hasClassTeacherRole(): boolean {
    const tokenPayload = this.storage.getPayload();
    return tokenPayload
      ? tokenPayload.roles.indexOf('ClassTeacherRole') >= 0
      : false;
  }
}
