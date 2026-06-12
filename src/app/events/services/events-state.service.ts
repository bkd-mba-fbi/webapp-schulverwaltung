import { Injectable, inject } from "@angular/core";
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
import { Course } from "src/app/shared/models/course.model";
import { StudyClass } from "src/app/shared/models/study-class.model";
import { CoursesRestService } from "src/app/shared/services/courses-rest.service";
import { LoadingService } from "src/app/shared/services/loading-service";
import { StudyClassesRestService } from "src/app/shared/services/study-classes-rest.service";
import { getCourseFilterParamsForScope } from "src/app/shared/utils/courses";
import { spread } from "src/app/shared/utils/function";
import { hasRole } from "src/app/shared/utils/roles";
import { searchEntries } from "src/app/shared/utils/search";
import { EventScope } from "../components/common/events-scope-select/events-scope-select.component";
import {
  EventStateWithLabel,
  getCourseDesignation,
  getEventState,
  isRated,
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
  private coursesRestService = inject(CoursesRestService);
  private studyClassRestService = inject(StudyClassesRestService);
  private loadingService = inject(LoadingService);
  private translate = inject(TranslateService);
  private router = inject(Router);

  loading$ = this.loadingService.loading$;

  private searchFields$ = new BehaviorSubject<ReadonlyArray<keyof EventEntry>>([
    "designation",
  ]);
  private searchSubject$ = new BehaviorSubject<string>("");
  search$ = this.searchSubject$.asObservable();

  private scopeSubject$ = new BehaviorSubject<EventScope>("current");
  scope$ = this.scopeSubject$.asObservable();

  private roles$ = new BehaviorSubject<Option<string>>(null);
  private isClassTeacher$ = this.roles$.pipe(
    map((roles) => hasRole(roles, "ClassTeacherRole")),
    shareReplay(1),
  );

  private events$ = this.getEvents().pipe(shareReplay(1));
  private filteredEvents$ = combineLatest([
    this.events$,
    this.searchFields$,
    this.search$,
  ]).pipe(map(spread(searchEntries)));

  setSearch(term: string): void {
    this.searchSubject$.next(term);
  }

  setScope(scope: EventScope): void {
    this.scopeSubject$.next(scope);
  }

  setRoles(roles: Option<string>): void {
    this.roles$.next(roles);
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
    const unratedCourses$ = combineLatest([this.scope$, this.roles$]).pipe(
      switchMap(spread(this.loadUnratedCourses.bind(this))),
    );
    const formativeAssessments$ = combineLatest([
      this.scope$,
      this.isClassTeacher$,
    ]).pipe(switchMap(spread(this.loadFormativeAssessments.bind(this))));
    const studyClasses$ = combineLatest([
      this.scope$,
      this.isClassTeacher$,
    ]).pipe(switchMap(spread(this.loadStudyClasses.bind(this))));

    return combineLatest([
      unratedCourses$,
      formativeAssessments$,
      studyClasses$,
    ]).pipe(map(spread(this.createAndSortEvents.bind(this))));
  }

  private loadUnratedCourses(
    scope: EventScope,
    roles: Option<string>,
  ): Observable<ReadonlyArray<Course>> {
    const params = getCourseFilterParamsForScope(scope);
    return this.loadingService
      .load(this.coursesRestService.getCourses(roles, params))
      .pipe(map((courses) => courses.filter((c) => !isRated(c))));
  }

  private loadFormativeAssessments(
    scope: EventScope,
    isClassTeacher: boolean,
  ): Observable<ReadonlyArray<StudyClass>> {
    if (scope === "past" || !isClassTeacher) return of([]);

    return this.loadingService.load(
      this.studyClassRestService.getActiveFormativeAssessments(),
    );
  }

  private loadStudyClasses(
    scope: EventScope,
    isClassTeacher: boolean,
  ): Observable<ReadonlyArray<StudyClass>> {
    if (scope === "past" || !isClassTeacher) return of([]);

    return this.loadingService.load(this.studyClassRestService.getActive());
  }

  private createAndSortEvents(
    courses: ReadonlyArray<Course>,
    formativeAssessments: ReadonlyArray<StudyClass>,
    studyClasses: ReadonlyArray<StudyClass>,
  ): ReadonlyArray<EventEntry> {
    const classesWithoutAssessments = studyClasses.filter(
      (c) => !formativeAssessments.map((fa) => fa.Id).includes(c.Id),
    );
    return [
      ...this.createFromCourses(courses),
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
            ? ["/events", course.Id, "evaluation"]
            : ["/events", course.Id, "tests"],
      };
    });
  }

  private createFromAssessments(
    studyClasses: ReadonlyArray<StudyClass>,
  ): ReadonlyArray<EventEntry> {
    const events = this.createFromStudyClasses(studyClasses);

    return events.map((e) => ({
      ...e,
      state: EventState.Rating,
      evaluationText: this.translate.instant("events.state.rating"),
      evaluationLink: ["/events", e.id, "evaluation"],
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
}
