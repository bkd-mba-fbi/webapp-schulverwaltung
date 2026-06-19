import { Injectable, inject } from "@angular/core";
import { isEqual, uniq } from "lodash-es";
import {
  BehaviorSubject,
  Observable,
  ReplaySubject,
  combineLatest,
  distinctUntilChanged,
  map,
  of,
  shareReplay,
  switchMap,
} from "rxjs";
import { EventScope } from "src/app/events/components/common/events-scope-select/events-scope-select.component";
import { filterEventsForScope } from "src/app/shared/utils/courses";
import { Course } from "../../shared/models/course.model";
import { CoursesRestService } from "../../shared/services/courses-rest.service";
import { GradingScalesRestService } from "../../shared/services/grading-scales-rest.service";
import { LoadingService } from "../../shared/services/loading-service";
import { ReportsService } from "../../shared/services/reports.service";
import { StorageService } from "../../shared/services/storage.service";
import { SubscriptionsRestService } from "../../shared/services/subscriptions-rest.service";
import { notNull } from "../../shared/utils/filter";

@Injectable()
export class MyGradesService {
  private storageService = inject(StorageService);
  private loadingService = inject(LoadingService);
  private coursesRestService = inject(CoursesRestService);
  private subscriptionRestService = inject(SubscriptionsRestService);
  private reportsService = inject(ReportsService);
  private gradingScalesRestService = inject(GradingScalesRestService);

  loading$ = this.loadingService.loading$;
  studentId$ = new ReplaySubject<number>(1);

  private subscriptionAndEventsIds$ = this.studentId$.pipe(
    switchMap(this.loadSubscriptionAndEventIds.bind(this)),
    shareReplay(1),
  );
  private subscriptionIds$ = this.subscriptionAndEventsIds$.pipe(
    map((ids) => ids.subscriptionIds),
  );
  private eventIds$ = this.subscriptionAndEventsIds$.pipe(
    map((ids) => ids.eventIds),
  );
  private scopeSubject$ = new BehaviorSubject<EventScope>("current");
  scope$ = this.scopeSubject$.asObservable();

  studentCourses$ = this.eventIds$.pipe(
    switchMap(this.loadCourses.bind(this)),
    switchMap((courses) =>
      this.scope$.pipe(
        map((scope) => this.filterAndSortCourses(scope, courses)),
      ),
    ),
    shareReplay(1),
  );

  testReports$ = this.subscriptionIds$.pipe(
    map((ids) => this.reportsService.getStudentSubscriptionGradesReports(ids)),
  );

  private tests$ = this.studentCourses$.pipe(
    map((courses) =>
      courses.flatMap((course: Course) => course.Tests).filter(notNull),
    ),
  );

  private gradingScaleIds$ = combineLatest([
    this.tests$.pipe(
      map((tests) => [...tests.map((test) => test.GradingScaleId)]),
    ),
    this.studentCourses$.pipe(
      map((courses) => courses.map((course) => course.GradingScaleId)),
    ),
  ]).pipe(
    map(([tests, courses]) => uniq([...tests, ...courses]).filter(notNull)),
    distinctUntilChanged(isEqual),
    shareReplay(1),
  );

  gradingScales$ = this.gradingScaleIds$.pipe(
    switchMap((ids) => this.gradingScalesRestService.getListForIds(ids)),
    shareReplay(1),
  );

  constructor() {
    const studentId = this.storageService.getPayload()?.id_person;
    if (studentId) {
      this.studentId$.next(Number(studentId));
    }
  }

  setScope(scope: EventScope): void {
    this.scopeSubject$.next(scope);
  }

  private loadCourses(
    eventIds: ReadonlyArray<number>,
  ): Observable<ReadonlyArray<Course>> {
    if (eventIds.length === 0) return of([]);

    return this.loadingService.load(
      this.coursesRestService.getCoursesForMyGrades(eventIds),
    );
  }

  private filterAndSortCourses(
    scope: EventScope,
    courses: ReadonlyArray<Course>,
  ): ReadonlyArray<Course> {
    return [...filterEventsForScope(scope, courses)].sort((a, b) =>
      a.Designation.localeCompare(b.Designation),
    );
  }

  private loadSubscriptionAndEventIds(studentId: number): Observable<{
    subscriptionIds: ReadonlyArray<number>;
    eventIds: ReadonlyArray<number>;
  }> {
    return this.loadingService.load(
      this.subscriptionRestService.getSubscriptionsByStudent(studentId).pipe(
        map((subscriptions) => ({
          subscriptionIds: subscriptions.map((s) => s.Id),
          eventIds: subscriptions.map((s) => s.EventId).filter(notNull),
        })),
      ),
    );
  }
}
