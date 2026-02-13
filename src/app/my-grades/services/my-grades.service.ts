import { Injectable, inject } from "@angular/core";
import { isEqual, uniq } from "lodash-es";
import {
  Observable,
  ReplaySubject,
  combineLatest,
  distinctUntilChanged,
  map,
  of,
  shareReplay,
  switchMap,
} from "rxjs";
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

  private studentCourses$ = this.eventIds$
    .pipe(switchMap(this.loadCourses.bind(this)))
    .pipe(shareReplay(1));
  studentCoursesSorted$ = this.studentCourses$.pipe(
    map((courses) =>
      courses
        .slice()
        .sort((c1, c2) => c1.Designation.localeCompare(c2.Designation)),
    ),
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

  private loadCourses(
    eventIds: ReadonlyArray<number>,
  ): Observable<ReadonlyArray<Course>> {
    if (eventIds.length === 0) return of([]);

    return this.loadingService.load(
      this.coursesRestService.getCoursesForMyGrades(eventIds),
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
