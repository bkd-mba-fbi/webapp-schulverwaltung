import { Inject, Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { format } from "date-fns";
import {
  BehaviorSubject,
  Observable,
  combineLatest,
  map,
  shareReplay,
  switchMap,
} from "rxjs";
import { SETTINGS, Settings } from "src/app/settings";
import { Course } from "src/app/shared/models/course.model";
import { StudyClass } from "src/app/shared/models/study-class.model";
import { CoursesRestService } from "src/app/shared/services/courses-rest.service";
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

type LinkType = "evaluation" | "eventdetail";
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

@Injectable({ providedIn: "root" })
export class EventsStateService {
  loading$ = this.loadingService.loading$;
  private searchSubject$ = new BehaviorSubject<string>("");
  search$ = this.searchSubject$.asObservable();
  private roles$ = new BehaviorSubject<Option<string>>(null);

  private formativeAssessments$ =
    this.studyClassRestService.getActiveFormativeAssessments();
  private studyClasses$ = this.studyClassRestService.getActive();

  private events$ = this.loadEvents().pipe(shareReplay(1));
  private filteredEvents$ = combineLatest([this.events$, this.search$]).pipe(
    map(spread(searchEntries)),
  );
  constructor(
    private coursesRestService: CoursesRestService,
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

  getEvents(withRatings = false): Observable<ReadonlyArray<Event>> {
    return this.filteredEvents$.pipe(
      map((events) =>
        withRatings ? events.filter((e) => e.evaluationText) : events,
      ),
    );
  }

  private loadEvents(): Observable<ReadonlyArray<Event>> {
    return this.roles$.pipe(
      switchMap((roles) =>
        this.loadingService.load(this.loadEventsForRoles(roles)),
      ),
    );
  }

  /**
   * Events are derived either from courses or study classes.
   * If the current user has the role 'ClassTeacherRole', additional requests to get study classes/formative assessments are made.
   */
  private loadEventsForRoles(
    roles: Maybe<string>,
  ): Observable<ReadonlyArray<Event>> {
    return hasRole(roles, "ClassTeacherRole")
      ? combineLatest([
          this.loadCoursesNotRated(roles),
          this.formativeAssessments$,
          this.studyClasses$,
        ]).pipe(map(spread(this.createAndSortEvents.bind(this))))
      : this.loadCoursesNotRated(roles).pipe(
          map((course) => this.createAndSortEvents(course)),
        );
  }

  private loadCoursesNotRated(
    roles: Maybe<string>,
  ): Observable<ReadonlyArray<Course>> {
    return this.coursesRestService
      .getExpandedCourses(roles)
      .pipe(map((courses) => courses.filter((c) => !isRated(c))));
  }

  private createAndSortEvents(
    courses: ReadonlyArray<Course>,
    formativeAssessments: ReadonlyArray<StudyClass> = [],
    studyClasses: ReadonlyArray<StudyClass> = [],
  ): ReadonlyArray<Event> {
    const classesWithoutAssessments = studyClasses.filter(
      (c) => !formativeAssessments.map((fa) => fa.Id).includes(c.Id),
    );
    return [
      ...this.createFromCourses(courses),
      ...this.createFromAssessments(formativeAssessments),
      ...this.createFromStudyClasses(classesWithoutAssessments),
    ].sort((a, b) => a.Designation.localeCompare(b.Designation));
  }

  private createFromStudyClasses(
    studyClasses: ReadonlyArray<StudyClass>,
  ): ReadonlyArray<Event> {
    return studyClasses.map((studyClass) => ({
      id: studyClass.Id,
      Designation: studyClass.Number,
      detailLink: this.buildLink(studyClass.Id, "eventdetail"),
      studentCount: studyClass.StudentCount,
      state: null,
    }));
  }

  private createFromAssessments(
    studyClasses: ReadonlyArray<StudyClass>,
  ): ReadonlyArray<Event> {
    const events = this.createFromStudyClasses(studyClasses);

    return events.map((e) => ({
      ...e,
      state: EventState.Rating,
      evaluationText: this.translate.instant("events.state.rating"),
      evaluationLink: this.buildLink(e.id, "evaluation"),
    }));
  }

  private createFromCourses(
    courses: ReadonlyArray<Course>,
  ): ReadonlyArray<Event> {
    return courses.map((course) => {
      const state = getEventState(course);

      return {
        id: course.Id,
        Designation: getCourseDesignation(course),
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
