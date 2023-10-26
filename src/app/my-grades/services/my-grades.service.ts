import { Inject, Injectable } from "@angular/core";
import { StorageService } from "../../shared/services/storage.service";
import {
  combineLatest,
  forkJoin,
  map,
  ReplaySubject,
  shareReplay,
  switchMap,
} from "rxjs";
import { LoadingService } from "../../shared/services/loading-service";
import { CoursesRestService } from "../../shared/services/courses-rest.service";
import { Course } from "../../shared/models/course.model";
import { SubscriptionsRestService } from "../../shared/services/subscriptions-rest.service";
import { ReportsService } from "../../shared/services/reports.service";
import { Settings, SETTINGS } from "../../settings";
import { notNull, unique } from "../../shared/utils/filter";
import { Test } from "../../shared/models/test.model";
import { GradingScalesRestService } from "../../shared/services/grading-scales-rest.service";

@Injectable()
export class MyGradesService {
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

  private idSubscriptions$ = combineLatest([
    this.studentId$,
    this.studentCourseIds$,
  ]).pipe(
    switchMap(([studentId, courseIds]) =>
      this.subscriptionRestService.getIdSubscriptionsByStudentAndCourse(
        studentId,
        courseIds,
      ),
    ),
  );

  private ids$ = this.idSubscriptions$.pipe(
    map((subscriptions) => subscriptions.map((s) => s.Id)),
  );

  testReportUrl$ = this.ids$.pipe(
    map((ids) =>
      this.reportsService.getSubscriptionReportUrl(
        this.settings.testsBySubscriptionReportIdStudent,
        ids,
      ),
    ),
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

  constructor(
    private storageService: StorageService,
    private loadingService: LoadingService,
    private coursesRestService: CoursesRestService,
    private subscriptionRestService: SubscriptionsRestService,
    private reportsService: ReportsService,
    private gradingScalesRestService: GradingScalesRestService,
    @Inject(SETTINGS) private settings: Settings,
  ) {
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
