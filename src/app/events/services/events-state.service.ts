import { Inject, Injectable } from "@angular/core";
import { Router, RouterLink } from "@angular/router";
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
import { StorageService } from "src/app/shared/services/storage.service";
import { StudyClassesRestService } from "src/app/shared/services/study-classes-rest.service";
import { spread } from "src/app/shared/utils/function";
import { hasRole } from "src/app/shared/utils/roles";
import { searchEntries } from "src/app/shared/utils/search";
import {
  EventStateWithLabel,
  getCourseDesignation,
  getEventState,
  isRated,
  isStudyCourseLeader,
} from "../utils/events";
import { getEventsStudentsLink } from "../utils/events-students";

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
  evaluationLink?: Option<RouterLink["routerLink"]>;
}

@Injectable({ providedIn: "root" })
export class EventsStateService {
  loading$ = this.loadingService.loading$;

  private searchFields$ = new BehaviorSubject<ReadonlyArray<keyof EventEntry>>([
    "designation",
  ]);

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
  private filteredEvents$ = combineLatest([
    this.events$,
    this.searchFields$,
    this.search$,
  ]).pipe(map(spread(searchEntries)));

  constructor(
    private coursesRestService: CoursesRestService,
    private eventsRestService: EventsRestService,
    private studyClassRestService: StudyClassesRestService,
    private loadingService: LoadingService,
    private storageService: StorageService,
    private translate: TranslateService,
    private router: Router,
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

  setSearchFields(searchFields: ReadonlyArray<keyof EventEntry>): void {
    this.searchFields$.next(searchFields);
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
        detailLink: this.buildStudentsLink(course.Id),
        studentCount: course.AttendanceRef.StudentCount || 0,
        dateFrom: course.DateFrom,
        dateTo: course.DateTo,
        state: state?.value || null,
        evaluationText: this.getEvaluationText(
          state,
          course.EvaluationStatusRef.EvaluationUntil,
        ),
        evaluationLink:
          state?.value && state?.value !== EventState.Tests
            ? this.buildEvaluationLink(course.Id)
            : null,
      };
    });
  }

  private createFromStudyCourses(
    studyCourses: ReadonlyArray<Event>,
  ): ReadonlyArray<EventEntry> {
    const tokenPayload = this.storageService.getPayload();
    return studyCourses
      .filter((studyCourse) => isStudyCourseLeader(tokenPayload, studyCourse)) // The user sees only the study courses he/she is leader of
      .map((studyCourse) => ({
        id: studyCourse.Id,
        designation: studyCourse.Designation,
        detailLink: this.buildStudentsLink(studyCourse.Id),
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
      evaluationLink: this.buildEvaluationLink(e.id),
    }));
  }

  private createFromStudyClasses(
    studyClasses: ReadonlyArray<StudyClass>,
  ): ReadonlyArray<EventEntry> {
    return studyClasses.map((studyClass) => ({
      id: studyClass.Id,
      designation: studyClass.Number,
      detailLink: this.buildStudentsLink(studyClass.Id),
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

  private buildStudentsLink(eventId: number) {
    return getEventsStudentsLink(eventId, this.router.url);
  }

  private buildEvaluationLink(id: number): RouterLink["routerLink"] {
    const link = this.settings.eventlist["evaluation"] ?? "";
    return link.replace(":id", String(id));
  }
}
