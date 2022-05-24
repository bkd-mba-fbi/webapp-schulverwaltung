import { Inject, Injectable } from '@angular/core';
import { StorageService } from '../../shared/services/storage.service';
import { combineLatest, map, ReplaySubject, switchMap } from 'rxjs';
import { LoadingService } from '../../shared/services/loading-service';
import { CoursesRestService } from '../../shared/services/courses-rest.service';
import { Course } from '../../shared/models/course.model';
import { SubscriptionsRestService } from '../../shared/services/subscriptions-rest.service';
import { ReportsService } from '../../shared/services/reports.service';
import { Settings, SETTINGS } from '../../settings';

@Injectable()
export class MyGradesService {
  studentId$ = new ReplaySubject<number>(1);

  loading$ = this.loadingService.loading$;

  studentCourses$ = this.loadCourses();

  private studentCourseIds$ = this.studentCourses$.pipe(
    map((courses) => courses.flatMap((course: Course) => course.Id))
  );

  private idSubscriptions$ = combineLatest([
    this.studentId$,
    this.studentCourseIds$,
  ]).pipe(
    switchMap(([studentId, courseIds]) =>
      this.subscriptionRestService.getIdSubscriptionsByStudentAndCourse(
        studentId,
        courseIds
      )
    )
  );

  private ids$ = this.idSubscriptions$.pipe(
    map((subscriptions) => subscriptions.map((s) => s.Id))
  );

  testReportUrl$ = this.ids$.pipe(
    map((ids) =>
      this.reportsService.getSubscriptionReportUrl(
        this.settings.testsBySubscriptionReportId,
        ids
      )
    )
  );

  constructor(
    private storageService: StorageService,
    private loadingService: LoadingService,
    private coursesRestService: CoursesRestService,
    private subscriptionRestService: SubscriptionsRestService,
    private reportsService: ReportsService,
    @Inject(SETTINGS) private settings: Settings
  ) {
    const studentId = this.storageService.getPayload()?.id_person || null;
    if (studentId) {
      this.studentId$.next(studentId);
    }
  }

  private loadCourses() {
    return this.loadingService.load(
      this.coursesRestService.getExpandedCoursesForStudent()
    );
  }
}
