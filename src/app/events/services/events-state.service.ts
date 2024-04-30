import { Inject, Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { format } from "date-fns";
import {
  BehaviorSubject,
  Observable,
  combineLatest,
  map,
  of,
  shareReplay,
  switchMap,
} from "rxjs";
import { SETTINGS, Settings } from "src/app/settings";
import { Course } from "src/app/shared/models/course.model";
import { Event } from "src/app/shared/models/event.model";
import { StudyClass } from "src/app/shared/models/study-class.model";
import { CoursesRestService } from "src/app/shared/services/courses-rest.service";
import { EventsRestService } from "src/app/shared/services/events-rest.service";
import { LoadingService } from "src/app/shared/services/loading-service";
import { StudyClassesRestService } from "src/app/shared/services/study-classes-rest.service";
import { spread } from "src/app/shared/utils/function";
import { hasRole } from "src/app/shared/utils/roles";
import { searchEntries } from "src/app/shared/utils/search";
import {
  EventStateWithLabel,
  getCourseDesignation,
  getEventState,
  isRated,
} from "../utils/events";

export enum EventState {
  Rating = "rating",
  RatingUntil = "rating-until",
  IntermediateRating = "intermediate-rating",
  Tests = "add-tests",
}

export interface EventEntry {
  id: number;
  designation: string;
  detailLink: string;
  dateFrom?: Option<Date>;
  dateTo?: Option<Date>;
  studentCount: number;
  state: Option<EventState>;
  evaluationText?: string;
  evaluationLink?: Option<string>;
}

type LinkType = "evaluation" | "eventdetail";

@Injectable({ providedIn: "root" })
export class EventsStateService {
  loading$ = this.loadingService.loading$;

  private searchSubject$ = new BehaviorSubject<string>("");
  search$ = this.searchSubject$.asObservable();

  private roles$ = new BehaviorSubject<Option<string>>(null);
  private isClassTeacher$ = this.roles$.pipe(
    map((roles) => hasRole(roles, "ClassTeacherRole")),
    shareReplay(1),
  );
  private withStudyCourses$ = new BehaviorSubject<boolean>(false);

  private unratedCourses$ = this.roles$.pipe(
    switchMap(this.loadUnratedCourses.bind(this)),
    shareReplay(1),
  );
  private studyCourses$ = this.withStudyCourses$.pipe(
    switchMap(this.loadStudyCourses.bind(this)),
    shareReplay(1),
  );
  private formativeAssessments$ = this.isClassTeacher$.pipe(
    switchMap(this.loadFormativeAssessments.bind(this)),
    shareReplay(1),
  );
  private studyClasses$ = this.isClassTeacher$.pipe(
    switchMap(this.loadStudyClasses.bind(this)),
    shareReplay(1),
  );

  private events$ = this.getEvents().pipe(shareReplay(1));
  private filteredEvents$ = combineLatest([this.events$, this.search$]).pipe(
    map(spread(searchEntries)),
  );

  constructor(
    private coursesRestService: CoursesRestService,
    private eventsRestService: EventsRestService,
    private studyClassRestService: StudyClassesRestService,
    private loadingService: LoadingService,
    private translate: TranslateService,
    @Inject(SETTINGS) private settings: Settings,
  ) {}

  setSearch(term: string): void {
    this.searchSubject$.next(term);
  }

  setRoles(roles: Option<string>): void {
    this.roles$.next(roles);
  }

  setWithStudyCourses(enabled: boolean): void {
    this.withStudyCourses$.next(enabled);
  }

  getEntries(withRatings = false): Observable<ReadonlyArray<EventEntry>> {
    return this.filteredEvents$.pipe(
      map((entries) =>
        withRatings ? entries.filter((e) => e.evaluationText) : entries,
      ),
    );
  }

  private getEvents(): Observable<ReadonlyArray<EventEntry>> {
    return this.loadingService
      .load(
        combineLatest([
          this.unratedCourses$,
          this.studyCourses$,
          this.formativeAssessments$,
          this.studyClasses$,
        ]),
        {
          stopOnFirstValue: true,
        },
      )
      .pipe(map(spread(this.createAndSortEvents.bind(this))));
  }

  private loadUnratedCourses(
    roles: Option<string>,
  ): Observable<ReadonlyArray<Course>> {
    return this.coursesRestService
      .getExpandedCourses(roles)
      .pipe(map((courses) => courses.filter((c) => !isRated(c))));
  }

  private loadStudyCourses(enabled: boolean): Observable<ReadonlyArray<Event>> {
    return enabled ? this.eventsRestService.getStudyCourseEvents() : of([]);
  }

  private loadFormativeAssessments(
    isClassTeacher: boolean,
  ): Observable<ReadonlyArray<StudyClass>> {
    return isClassTeacher
      ? this.studyClassRestService.getActiveFormativeAssessments()
      : of([]);
  }

  private loadStudyClasses(
    isClassTeacher: boolean,
  ): Observable<ReadonlyArray<StudyClass>> {
    return isClassTeacher ? this.studyClassRestService.getActive() : of([]);
  }

  private createAndSortEvents(
    courses: ReadonlyArray<Course>,
    studyCourses: ReadonlyArray<Event>,
    formativeAssessments: ReadonlyArray<StudyClass>,
    studyClasses: ReadonlyArray<StudyClass>,
  ): ReadonlyArray<EventEntry> {
    const classesWithoutAssessments = studyClasses.filter(
      (c) => !formativeAssessments.map((fa) => fa.Id).includes(c.Id),
    );
    return [
      ...this.createFromCourses(courses),
      ...this.createFromStudyCourses(studyCourses),
      ...this.createFromAssessments(formativeAssessments),
      ...this.createFromStudyClasses(classesWithoutAssessments),
    ].sort((a, b) => a.designation.localeCompare(b.designation));
  }

  private createFromCourses(
    courses: ReadonlyArray<Course>,
  ): ReadonlyArray<EventEntry> {
    return courses.map((course) => {
      const state = getEventState(course);

      return {
        id: course.Id,
        designation: getCourseDesignation(course),
        detailLink: this.buildLink(course.Id, "eventdetail"),
        studentCount: course.AttendanceRef.StudentCount || 0,
        dateFrom: course.DateFrom,
        dateTo: course.DateTo,
        state: state?.value || null,
        evaluationText: this.getEvaluationText(
          state,
          course.EvaluationStatusRef.EvaluationUntil,
        ),
        evaluationLink: this.getEvaluationLink(state?.value, course),
      };
    });
  }

  private createFromStudyCourses(
    studyCourses: ReadonlyArray<Event>,
  ): ReadonlyArray<EventEntry> {
    return studyCourses.map((studyCourse) => ({
      id: studyCourse.Id,
      designation: studyCourse.Designation,
      detailLink: this.buildLink(studyCourse.Id, "eventdetail"),
      studentCount: studyCourse.StudentCount,
      state: null,
    }));
  }

  private createFromAssessments(
    studyClasses: ReadonlyArray<StudyClass>,
  ): ReadonlyArray<EventEntry> {
    const events = this.createFromStudyClasses(studyClasses);

    return events.map((e) => ({
      ...e,
      state: EventState.Rating,
      evaluationText: this.translate.instant("events.state.rating"),
      evaluationLink: this.buildLink(e.id, "evaluation"),
    }));
  }

  private createFromStudyClasses(
    studyClasses: ReadonlyArray<StudyClass>,
  ): ReadonlyArray<EventEntry> {
    return studyClasses.map((studyClass) => ({
      id: studyClass.Id,
      designation: studyClass.Number,
      detailLink: this.buildLink(studyClass.Id, "eventdetail"),
      studentCount: studyClass.StudentCount,
      state: null,
    }));
  }

  private getEvaluationText(
    state: Option<EventStateWithLabel>,
    date?: Maybe<Date>,
  ): string {
    const label = state?.label || state?.value;
    return label
      ? this.translate.instant(`events.state.${label}`) +
          (label === EventState.RatingUntil
            ? ` ${date ? format(date, "dd.MM.yyyy") : ""}`
            : "")
      : "";
  }

  private getEvaluationLink(
    state: Maybe<EventState>,
    course: Course,
  ): Option<string> {
    return state && state !== EventState.Tests
      ? this.buildLink(course.Id, "evaluation")
      : null;
  }

  private buildLink(id: number, linkType: LinkType): string {
    const link = this.settings.eventlist[linkType] ?? "";
    return link.replace(":id", String(id));
  }
}
