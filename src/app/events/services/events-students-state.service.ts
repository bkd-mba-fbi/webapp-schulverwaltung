import { Injectable, computed, signal } from "@angular/core";
import { toObservable, toSignal } from "@angular/core/rxjs-interop";
import { ActivatedRoute } from "@angular/router";
import { Observable, combineLatest, filter, map, of, switchMap } from "rxjs";
import { ApprenticeshipContractsRestService } from "src/app/shared/services/apprenticeship-contracts-rest.service";
import { CoursesRestService } from "src/app/shared/services/courses-rest.service";
import { EventsRestService } from "src/app/shared/services/events-rest.service";
import { LessonPresencesRestService } from "src/app/shared/services/lesson-presences-rest.service";
import { LoadingService } from "src/app/shared/services/loading-service";
import { PAGE_LOADING_CONTEXT } from "src/app/shared/services/paginated-entries.service";
import { PersonsRestService } from "src/app/shared/services/persons-rest.service";
import {
  ReportInfo,
  ReportsService,
} from "src/app/shared/services/reports.service";
import { notNull } from "src/app/shared/utils/filter";
import { spread } from "src/app/shared/utils/function";
import { searchEntries } from "src/app/shared/utils/search";
import { SubscriptionsRestService } from "../../shared/services/subscriptions-rest.service";
import { SortCriteria } from "../../shared/utils/sort";
import {
  convertCourseToStudentEntries,
  convertPersonsToStudentEntries,
  decorateCourseStudentsWithCompanies,
  decorateStudyClasses,
} from "../utils/events-students";

export const STUDY_COURSE_TYPE_ID = 1;
export const COURSE_TYPE_ID = 3;
export const STUDY_CLASS_TYPE_ID = 10;

export type StudentEntries = {
  eventId: number;
  eventDesignation: string;
  studyClasses: string[];
  entries: ReadonlyArray<StudentEntry>;
};

export type StudentEntry = {
  id: number;
  firstName: string;
  lastName: string;
  email?: string;
  status?: string;
  studyClass?: string;
  company?: string;
};

export type PrimarySortKey = "name";

@Injectable({
  providedIn: "root",
})
export class EventsStudentsStateService {
  private eventId$ = this.route.paramMap.pipe(
    map((params) => Number(params.get("id"))),
  );
  private eventTypeId = toSignal(
    this.eventId$.pipe(switchMap(this.loadEventTypeId.bind(this))),
    { initialValue: null },
  );
  private studentEntries = toSignal(this.loadStudentEntries(), {
    initialValue: null,
  });

  isStudyCourse = computed(() => this.eventTypeId() === STUDY_COURSE_TYPE_ID);

  loading = toSignal(this.loadingService.loading(PAGE_LOADING_CONTEXT));
  title = computed(() => this.getTitle(this.studentEntries()));
  multipleStudyClasses = computed(
    () => (this.studentEntries()?.studyClasses?.length ?? 0) > 1,
  );
  searchTerm = signal("");
  sortCriteria = signal<SortCriteria<PrimarySortKey>>({
    primarySortKey: "name",
    ascending: true,
  });
  entries = computed(() => this.studentEntries()?.entries ?? []);
  sortedEntries = computed(() =>
    this.sortStudentEntries(this.entries(), this.sortCriteria()),
  );
  filteredEntries = computed(() =>
    searchEntries(
      this.sortedEntries(),
      ["firstName", "lastName", "status", "company", "studyClass"],
      this.searchTerm(),
    ),
  );
  mailtoLink = computed(() =>
    this.getMailtoLink(this.eventTypeId(), this.entries()),
  );

  reports = toSignal(
    combineLatest([
      this.eventId$,
      toObservable(this.eventTypeId).pipe(filter(notNull)),
    ]).pipe(switchMap(spread(this.loadReports.bind(this)))),
    { initialValue: [] },
  );

  constructor(
    private route: ActivatedRoute,
    private loadingService: LoadingService,
    private eventsService: EventsRestService,
    private coursesService: CoursesRestService,
    private subscriptionsService: SubscriptionsRestService,
    private personsService: PersonsRestService,
    private apprenticeshipContractsService: ApprenticeshipContractsRestService,
    private lessonPresencesService: LessonPresencesRestService,
    private reportsService: ReportsService,
  ) {}

  private loadEventTypeId(eventId: number): Observable<Option<number>> {
    return this.loadingService.load(
      this.eventsService.getEventTypeId(eventId),
      PAGE_LOADING_CONTEXT,
    );
  }

  private loadStudentEntries(): Observable<Option<StudentEntries>> {
    return combineLatest([this.eventId$, toObservable(this.eventTypeId)]).pipe(
      switchMap(([eventId, eventTypeId]) => {
        const fetch = () => {
          switch (eventTypeId) {
            case null:
              return of(null);
            case STUDY_COURSE_TYPE_ID: // Studiengang
              return this.loadStudyCourseStudents(eventId);
            case STUDY_CLASS_TYPE_ID: // Klasse
              return this.loadStudyClassStudents(eventId);
            default: // Fach
              return this.loadCourseStudents(eventId);
          }
        };
        return this.loadingService.load(fetch(), PAGE_LOADING_CONTEXT);
      }),
    );
  }

  toggleSort(): void {
    this.sortCriteria.update((value) => ({
      ...value,
      ascending: !value.ascending,
    }));
  }

  private loadStudyCourseStudents(eventId: number): Observable<StudentEntries> {
    return this.loadSubscriptionStudents(eventId);
  }

  private loadStudyClassStudents(eventId: number): Observable<StudentEntries> {
    return this.loadSubscriptionStudents(eventId, {
      "filter.IsOkay": "=1",
    });
  }

  private loadSubscriptionStudents(
    eventId: number,
    additionalParams?: Dict<string>,
  ): Observable<StudentEntries> {
    return this.subscriptionsService
      .getSubscriptionsByCourse(eventId, additionalParams)
      .pipe(
        switchMap((subscriptions) =>
          this.personsService
            .getSummaries(
              subscriptions.map(({ PersonId }) => PersonId).filter(notNull),
            )
            .pipe(
              map((students) =>
                convertPersonsToStudentEntries(
                  eventId,
                  students,
                  subscriptions,
                ),
              ),
            ),
        ),
      );
  }

  private loadCourseStudents(eventId: number): Observable<StudentEntries> {
    return this.coursesService.getExpandedCourseWithParticipants(eventId).pipe(
      map(convertCourseToStudentEntries),
      switchMap((students) =>
        combineLatest([
          this.apprenticeshipContractsService.getCompaniesForStudents(
            students.entries.map(({ id }) => id),
          ),
          this.lessonPresencesService.getLessonStudyClassesByEvent(eventId), // Fetched separately as a workaround since the study classes are not available on the students yet
        ]).pipe(
          map(([contracts, studyClasses]) => {
            const studentsWithCompanies = decorateCourseStudentsWithCompanies(
              students,
              contracts,
            );
            return decorateStudyClasses(studentsWithCompanies, studyClasses);
          }),
        ),
      ),
    );
  }

  private getTitle(entries: Option<StudentEntries>): Option<string> {
    if (!entries || !entries.eventDesignation) {
      return null;
    }

    const { eventDesignation, studyClasses } = entries;
    return [eventDesignation, ...studyClasses].join(", ");
  }

  private getMailtoLink(
    eventTypeId: Option<number>,
    entries: ReadonlyArray<StudentEntry>,
  ): Option<string> {
    if (eventTypeId === null || eventTypeId === STUDY_COURSE_TYPE_ID) {
      return null;
    }

    const emails = entries.map((entry) => entry.email).filter(Boolean);
    return emails.length > 0 ? `mailto:${emails.join(",")}` : null;
  }

  private loadReports(
    eventId: number,
    eventTypeId: number,
  ): Observable<ReadonlyArray<ReportInfo>> {
    switch (eventTypeId) {
      case null:
      case STUDY_COURSE_TYPE_ID: // Studiengang
        return of([]);
      case STUDY_CLASS_TYPE_ID: // Klasse
        return this.reportsService.getStudyClassStudentsReports(eventId);
      default: // Fach
        return this.reportsService.getCourseStudentsReports(eventId);
    }
  }

  private sortStudentEntries(
    entries: ReadonlyArray<StudentEntry>,
    sortCriteria: SortCriteria<PrimarySortKey>,
  ): ReadonlyArray<StudentEntry> {
    return [...entries].sort(getStudentEntryComparator(sortCriteria));
  }
}

function getStudentEntryComparator<PrimarySortKey>(
  sortCriteria: SortCriteria<PrimarySortKey>,
): (a: StudentEntry, b: StudentEntry) => number {
  return (a, b) => {
    const fullNameA = `${a.firstName} ${a.lastName}`;
    const fullNameB = `${b.firstName} ${b.lastName}`;
    return sortCriteria.ascending
      ? fullNameA.localeCompare(fullNameB)
      : fullNameB.localeCompare(fullNameA);
  };
}