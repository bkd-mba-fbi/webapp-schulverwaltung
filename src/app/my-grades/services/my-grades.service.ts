import { Injectable, inject } from "@angular/core";
import {
  ReplaySubject,
  combineLatest,
  forkJoin,
  map,
  shareReplay,
  switchMap,
} from "rxjs";
import { SETTINGS, Settings } from "../../settings";
import { Course } from "../../shared/models/course.model";
import { Test } from "../../shared/models/test.model";
import { CoursesRestService } from "../../shared/services/courses-rest.service";
import { GradingScalesRestService } from "../../shared/services/grading-scales-rest.service";
import { LoadingService } from "../../shared/services/loading-service";
import { ReportsService } from "../../shared/services/reports.service";
import { StorageService } from "../../shared/services/storage.service";
import { SubscriptionsRestService } from "../../shared/services/subscriptions-rest.service";
import { notNull, unique } from "../../shared/utils/filter";

@Injectable()
export class MyGradesService {
  private storageService = inject(StorageService);
  private loadingService = inject(LoadingService);
  private coursesRestService = inject(CoursesRestService);
  private subscriptionRestService = inject(SubscriptionsRestService);
  private reportsService = inject(ReportsService);
  private gradingScalesRestService = inject(GradingScalesRestService);
  private settings = inject<Settings>(SETTINGS);

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

  private gradingScaleIdsFromTests$ = this.tests$.pipe(
    map((tests: Test[]) =>
      [...tests.map((test: Test) => test.GradingScaleId)]
        .filter(notNull)
        .filter(unique),
    ),
  );

  private gradingScaleIdsFromCourses$ = this.studentCourses$.pipe(
    map((courses) =>
      courses
        .flatMap((course: Course) => course.GradingScaleId)
        .filter(notNull)
        .filter(unique),
    ),
  );

  private gradingScaleIds$ = combineLatest([
    this.gradingScaleIdsFromCourses$,
    this.gradingScaleIdsFromTests$,
  ]).pipe(
    map(([courseGradingsScaleIds, testGradingScaleIds]: [number[], number[]]) =>
      courseGradingsScaleIds.concat(testGradingScaleIds).filter(unique),
    ),
  );

  gradingScales$ = this.gradingScaleIds$.pipe(
    switchMap((ids) =>
      forkJoin(
        ids.map((id: number) =>
          this.gradingScalesRestService.getGradingScale(id),
        ),
      ),
    ),
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
