import { Injectable, inject } from "@angular/core";
import { Router } from "@angular/router";
import {
  BehaviorSubject,
  Observable,
  combineLatest,
  map,
  of,
  shareReplay,
  switchMap,
} from "rxjs";
import { EventEntry } from "src/app/events/services/events-state.service";
import { getEventsStudentsLink } from "src/app/events/utils/events-students";
import { Event } from "src/app/shared/models/event.model";
import { EventLeadershipRestService } from "src/app/shared/services/event-leadership-rest.service";
import { EventsRestService } from "src/app/shared/services/events-rest.service";
import { LoadingService } from "src/app/shared/services/loading-service";
import { StorageService } from "src/app/shared/services/storage.service";
import { SubscriptionsRestService } from "src/app/shared/services/subscriptions-rest.service";
import { spread } from "src/app/shared/utils/function";
import { searchEntries } from "src/app/shared/utils/search";

@Injectable()
export class StudyCoursesStateService {
  private router = inject(Router);
  private loadingService = inject(LoadingService);
  private storageService = inject(StorageService);
  private eventsRestService = inject(EventsRestService);
  private subscriptionsRestService = inject(SubscriptionsRestService);
  private eventLeadershipService = inject(EventLeadershipRestService);

  loading$ = this.loadingService.loading$;

  private searchSubject$ = new BehaviorSubject<string>("");
  search$ = this.searchSubject$.asObservable();

  private unfilteredStudyCourses$ = this.loadStudyCourses().pipe(
    shareReplay(1),
  );
  studyCourses$ = combineLatest([
    this.unfilteredStudyCourses$,
    of(["designation"] as ReadonlyArray<keyof EventEntry>),
    this.search$,
  ]).pipe(map(spread(searchEntries)));

  constructor() {}

  setSearch(term: string): void {
    this.searchSubject$.next(term);
  }

  private loadStudyCourses(): Observable<ReadonlyArray<EventEntry>> {
    return this.loadingService.load(
      this.eventsRestService.getStudyCourseEvents().pipe(
        switchMap(this.filterLeadingStudyCourses.bind(this)), // The user sees only the study courses he/she is leader of
        switchMap(this.decorateWithStudentCounts.bind(this)),
        map(this.createFromStudyCourses.bind(this)),
        map((studyCourses) =>
          [...studyCourses].sort((a, b) =>
            a.designation.localeCompare(b.designation),
          ),
        ),
      ),
      {
        stopOnFirstValue: true,
      },
    );
  }

  private filterLeadingStudyCourses(
    studyCourses: ReadonlyArray<Event>,
  ): Observable<ReadonlyArray<Event>> {
    return this.loadLeadingEventIds(studyCourses).pipe(
      map((leadingEventIds) =>
        studyCourses.filter((studyCourse) =>
          leadingEventIds.includes(studyCourse.Id),
        ),
      ),
    );
  }

  private loadLeadingEventIds(
    studyCourses: ReadonlyArray<Event>,
  ): Observable<ReadonlyArray<number>> {
    const personId = this.storageService.getPayload()?.id_person;
    if (!personId) return of([]);

    const eventIds = studyCourses.map((studyCourse) => studyCourse.Id);

    return this.eventLeadershipService
      .getLeadershipsForPersonAndEvents(Number(personId), eventIds)
      .pipe(
        map((leaderships) =>
          leaderships.map((leadership) => leadership.EventId),
        ),
      );
  }

  private decorateWithStudentCounts(
    studyCourses: ReadonlyArray<Event>,
  ): Observable<ReadonlyArray<Event>> {
    return studyCourses.length > 0
      ? this.subscriptionsRestService
          .getSubscriptionCountsByEvents(studyCourses.map((s) => s.Id))
          .pipe(
            map((subscriptionCounts) =>
              studyCourses.map((studyCourse) => ({
                ...studyCourse,
                StudentCount: subscriptionCounts[studyCourse.Id] ?? 0,
              })),
            ),
          )
      : of(studyCourses);
  }

  private createFromStudyCourses(
    studyCourses: ReadonlyArray<Event>,
  ): ReadonlyArray<EventEntry> {
    return studyCourses.map((studyCourse) => ({
      id: studyCourse.Id,
      designation: studyCourse.Designation,
      detailLink: this.buildStudentsLink(studyCourse.Id),
      studentCount: studyCourse.StudentCount,
      state: null,
    }));
  }

  private buildStudentsLink(eventId: number) {
    return getEventsStudentsLink(eventId, this.router.url);
  }
}
