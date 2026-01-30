import { Injectable, inject } from "@angular/core";
import { isEqual, uniq } from "lodash-es";
import {
  ReplaySubject,
  combineLatest,
  distinctUntilChanged,
  filter,
  map,
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

  studentId$ = new ReplaySubject<number>(1);

  loading$ = this.loadingService.loading$;

  private studentCourses$ = this.loadCourses().pipe(shareReplay(1));
  studentCoursesSorted$ = this.studentCourses$.pipe(
    map((courses) =>
      courses
        .slice()
        .sort((c1, c2) => c1.Designation.localeCompare(c2.Designation)),
    ),
  );
  private studentCourseIds$ = this.studentCourses$.pipe(
    map((courses) => courses.flatMap((course: Course) => course.Id)),
  );

  private subscriptionIds$ = combineLatest([
    this.studentId$,
    this.studentCourseIds$,
  ]).pipe(
    filter(([_, courseIds]) => courseIds.length > 0),
    switchMap(([studentId, courseIds]) =>
      this.subscriptionRestService.getSubscriptionIdsByStudentAndCourse(
        studentId,
        courseIds,
      ),
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

  private loadCourses() {
    return this.loadingService.load(
      this.coursesRestService.getExpandedCoursesForStudent(),
    );
  }
}
