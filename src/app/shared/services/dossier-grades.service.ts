import { Inject, Injectable } from '@angular/core';
import {
  combineLatest,
  distinctUntilChanged,
  forkJoin,
  map,
  ReplaySubject,
  shareReplay,
  switchMap,
} from 'rxjs';
import { Settings, SETTINGS } from 'src/app/settings';
import { Course, FinalGrading, Grading } from '../models/course.model';
import { GradingScale } from '../models/grading-scale.model';
import { Test } from '../models/test.model';
import { notNull, unique } from '../utils/filter';
import { CoursesRestService } from './courses-rest.service';
import { GradingScalesRestService } from './grading-scales-rest.service';
import { LoadingService } from './loading-service';
import { ReportsService } from './reports.service';
import { SubscriptionsRestService } from './subscriptions-rest.service';

@Injectable()
export class DossierGradesService {
  private studentId$ = new ReplaySubject<number>(1);

  studentCourses$ = this.studentId$.pipe(
    distinctUntilChanged(),
    switchMap(this.loadCourses.bind(this)),
    map((courses) =>
      courses.sort((c1, c2) => c1.Designation.localeCompare(c2.Designation))
    ),
    shareReplay(1)
  );

  loading$ = this.loadingService.loading$;

  private studentCourseIds$ = this.studentCourses$.pipe(
    map((courses: Course[]) => courses.flatMap((course) => course.Id))
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
    private coursesRestService: CoursesRestService,
    private subscriptionRestService: SubscriptionsRestService,
    private reportsService: ReportsService,
    private loadingService: LoadingService,
    private gradingScalesRestService: GradingScalesRestService,
    @Inject(SETTINGS) private settings: Settings
  ) {}

  setStudentId(id: number) {
    this.studentId$.next(id);
  }

  getFinalGradeForStudent(
    course: Course,
    studentId: number
  ): FinalGrading | undefined {
    return course?.FinalGrades?.find(
      (finaleGrade) => finaleGrade.StudentId === studentId
    );
  }

  getGradingForStudent(course: Course, studentId: number): Grading | undefined {
    return course?.Gradings?.find((grade) => grade.StudentId === studentId);
  }

  getGradingScaleOfCourse(course: Course, gradingScales: GradingScale[]) {
    return gradingScales?.find(
      (gradingScale) => gradingScale.Id === course.GradingScaleId
    );
  }

  private loadCourses(studentId: number) {
    return this.loadingService.load(
      this.coursesRestService
        .getExpandedCoursesForDossier()
        .pipe(
          map((courses) =>
            courses.filter((course) =>
              course.ParticipatingStudents?.find(
                (student) => student.Id === studentId
              )
            )
          )
        )
    );
  }

  // TODO: code below this is a duplication from the test-edit-state service that
  // was refactored by mfehlmann and hupf on another branch.
  // if it is merged, integrate changes and dry it up.

  private tests$ = this.studentCourses$.pipe(
    map((courses: Course[]) =>
      courses.flatMap((course: Course) => course.Tests).filter(notNull)
    )
  );

  private gradingScaleIdsFromTests$ = this.tests$.pipe(
    map((tests: Test[]) =>
      [...tests.map((test: Test) => test.GradingScaleId)]
        .filter(notNull)
        .filter(unique)
    )
  );

  private gradingScaleIdsFromCourses$ = this.studentCourses$.pipe(
    map((courses: Course[]) =>
      courses
        .flatMap((course: Course) => course.GradingScaleId)
        .filter(notNull)
        .filter(unique)
    )
  );

  private gradingScaleIds$ = combineLatest([
    this.gradingScaleIdsFromCourses$,
    this.gradingScaleIdsFromTests$,
  ]).pipe(
    map(([courseGradingsScaleIds, testGradingScaleIds]: [number[], number[]]) =>
      courseGradingsScaleIds.concat(testGradingScaleIds).filter(unique)
    )
  );

  gradingScales$ = this.gradingScaleIds$.pipe(
    switchMap((ids) =>
      forkJoin(
        ids.map((id: number) =>
          this.gradingScalesRestService.getGradingScale(id)
        )
      )
    )
  );
}
