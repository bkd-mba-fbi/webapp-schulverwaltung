import { Inject, Injectable } from "@angular/core";
import {
  ReplaySubject,
  combineLatest,
  distinctUntilChanged,
  forkJoin,
  map,
  merge,
  shareReplay,
  switchMap,
} from "rxjs";
import { scan } from "rxjs/operators";
import { SETTINGS, Settings } from "src/app/settings";
import { gradingScaleOfTest, resultOfStudent } from "../../events/utils/tests";
import { Course, FinalGrading, Grading } from "../models/course.model";
import { Grade, GradingScale } from "../models/grading-scale.model";
import { Test } from "../models/test.model";
import { notNull, unique } from "../utils/filter";
import { ValueWithWeight } from "../utils/math";
import { CoursesRestService } from "./courses-rest.service";
import { GradingScalesRestService } from "./grading-scales-rest.service";
import { LoadingService } from "./loading-service";
import { ReportsService } from "./reports.service";
import { SubscriptionsRestService } from "./subscriptions-rest.service";

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
  private studentId$ = new ReplaySubject<number>(1);
  private initialStudentCourses$ = this.studentId$.pipe(
    distinctUntilChanged(),
    switchMap(this.loadCourses.bind(this)),
    map((courses) =>
      courses.sort((c1, c2) => c1.Designation.localeCompare(c2.Designation)),
    ),
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

  loading$ = this.loadingService.loading$;

  private studentCourseIds$ = this.studentCourses$.pipe(
    map((courses) => courses.flatMap((course) => course.Id)),
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

  testReports$ = this.ids$.pipe(
    map((ids) => this.reportsService.getTeacherSubscriptionReports(ids)),
  );

  constructor(
    private coursesRestService: CoursesRestService,
    private subscriptionRestService: SubscriptionsRestService,
    private reportsService: ReportsService,
    private loadingService: LoadingService,
    private gradingScalesRestService: GradingScalesRestService,
    @Inject(SETTINGS) private settings: Settings,
  ) {}

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

  private loadCourses(studentId: number) {
    return this.loadingService.load(
      this.coursesRestService
        .getExpandedCoursesForDossier()
        .pipe(
          map((courses) =>
            courses.filter((course) =>
              course.ParticipatingStudents?.find(
                (student) => student.Id === studentId,
              ),
            ),
          ),
        ),
    );
  }

  // TODO: code below this is a duplication from the test-edit-state service that
  // was refactored by mfehlmann and hupf on another branch.
  // if it is merged, integrate changes and dry it up.

  private tests$ = this.studentCourses$.pipe(
    map((courses) => courses.flatMap((course) => course.Tests).filter(notNull)),
  );

  private gradingScaleIdsFromTests$ = this.tests$.pipe(
    map((tests) =>
      [...tests.map((test) => test.GradingScaleId)]
        .filter(notNull)
        .filter(unique),
    ),
  );

  private gradingScaleIdsFromCourses$ = this.studentCourses$.pipe(
    map((courses) =>
      courses
        .flatMap((course) => course.GradingScaleId)
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
        ids.map((id) => this.gradingScalesRestService.getGradingScale(id)),
      ),
    ),
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
