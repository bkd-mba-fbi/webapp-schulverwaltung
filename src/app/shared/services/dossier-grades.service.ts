import { Injectable, inject } from "@angular/core";
import { isEqual, uniq } from "lodash-es";
import {
  Observable,
  ReplaySubject,
  combineLatest,
  distinctUntilChanged,
  map,
  merge,
  of,
  shareReplay,
  startWith,
  switchMap,
} from "rxjs";
import { scan, skip } from "rxjs/operators";
import { gradingScaleOfTest, resultOfStudent } from "../../events/utils/tests";
import { Course, FinalGrading, Grading } from "../models/course.model";
import { Grade, GradingScale } from "../models/grading-scale.model";
import { Test } from "../models/test.model";
import { notNull } from "../utils/filter";
import { ValueWithWeight } from "../utils/math";
import { CoursesRestService } from "./courses-rest.service";
import { GradingScalesRestService } from "./grading-scales-rest.service";
import { LoadingService } from "./loading-service";
import { ReportsService } from "./reports.service";
import { SubscriptionsRestService } from "./subscriptions-rest.service";

const GRADES_CONTEXT = "studentDossierGrades";

type CoursesAction =
  | {
      type: "initializeCourses";
      payload: Course[];
    }
  | {
      type: "updateCourses";
      payload: Test;
    };

@Injectable()
export class DossierGradesService {
  private coursesRestService = inject(CoursesRestService);
  private subscriptionRestService = inject(SubscriptionsRestService);
  private reportsService = inject(ReportsService);
  private loadingService = inject(LoadingService);
  private gradingScalesRestService = inject(GradingScalesRestService);

  private studentId$ = new ReplaySubject<number>(1);
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

  private initialStudentCourses$ = this.eventIds$.pipe(
    distinctUntilChanged(isEqual),
    switchMap((eventIds) => this.loadCourses(eventIds)),
    map((courses) =>
      [...courses].sort((c1, c2) =>
        c1.Designation.localeCompare(c2.Designation),
      ),
    ),
    startWith([]),
    shareReplay(1),
  );

  action$ = new ReplaySubject<CoursesAction>(1);
  studentCourses$ = merge(
    this.action$,
    this.initialStudentCourses$.pipe(
      map(
        (courses): CoursesAction => ({
          type: "initializeCourses",
          payload: courses,
        }),
      ),
    ),
  ).pipe(
    scan(this.coursesReducer.bind(this), [] as ReadonlyArray<Course>),
    shareReplay(1),
  );

  loading$ = this.loadingService.loading(GRADES_CONTEXT);

  testReports$ = this.subscriptionIds$.pipe(
    map((ids) =>
      ids.length > 0
        ? this.reportsService.getTeacherSubscriptionGradesReports(ids)
        : [],
    ),
  );

  setStudentId(id: number) {
    this.studentId$.next(id);
  }

  getFinalGradeForStudent(
    course: Course,
    studentId: number,
  ): FinalGrading | undefined {
    return course?.FinalGrades?.find(
      (finaleGrade) => finaleGrade.StudentId === studentId,
    );
  }

  getGradingForStudent(course: Course, studentId: number): Grading | undefined {
    return course?.Gradings?.find((grade) => grade.StudentId === studentId);
  }

  getGradingScaleOfCourse(
    course: Course,
    gradingScales: ReadonlyArray<GradingScale>,
  ) {
    return gradingScales?.find(
      (gradingScale) => gradingScale.Id === course.GradingScaleId,
    );
  }

  getGradesForStudent(
    course: Course,
    studentId: number,
    gradingScales: ReadonlyArray<GradingScale>,
  ): ValueWithWeight[] {
    return (
      course.Tests?.flatMap((test) => {
        const grade = Number(
          gradingScaleOfTest(test, gradingScales)?.Grades.find(
            (grade: Grade) =>
              grade.Id === resultOfStudent(studentId, test)?.GradeId,
          )?.Designation,
        );

        return {
          value: grade,
          weight: test.Weight,
        };
      }).filter(({ value }) => Boolean(value)) || []
    );
  }

  updateStudentCourses(test: Test) {
    this.action$.next({
      type: "updateCourses",
      payload: test,
    });
  }

  private loadCourses(
    eventIds: ReadonlyArray<number>,
  ): Observable<ReadonlyArray<Course>> {
    if (eventIds.length === 0) return of([]);

    return this.loadingService.load(
      this.coursesRestService.getCoursesForDossier(eventIds),
      { context: GRADES_CONTEXT },
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
      { context: GRADES_CONTEXT },
    );
  }

  private tests$ = this.studentCourses$.pipe(
    map((courses) => courses.flatMap((course) => course.Tests).filter(notNull)),
  );

  private gradingScaleIds$ = combineLatest([
    this.tests$.pipe(
      map((tests) => [...tests.map((test) => test.GradingScaleId)]),
      skip(1),
    ),
    this.studentCourses$.pipe(
      map((courses) => courses.map((course) => course.GradingScaleId)),
      skip(1),
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

  private coursesReducer(
    state: ReadonlyArray<Course>,
    action: CoursesAction,
  ): ReadonlyArray<Course> {
    switch (action.type) {
      case "initializeCourses":
        return action.payload;
      case "updateCourses":
        return this.updateCourses([...state], action.payload);
      default:
        return state;
    }
  }

  private updateCourses(courses: Course[], updatedTest: Test): Course[] {
    return courses.map((course) => ({
      ...course,
      Tests:
        course.Tests !== null
          ? course.Tests.map((test) =>
              test.Id === updatedTest.Id ? updatedTest : test,
            )
          : null,
    }));
  }
}
