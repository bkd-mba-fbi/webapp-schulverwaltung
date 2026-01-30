import { Injectable, inject } from "@angular/core";
import { isEqual, uniq } from "lodash-es";
import {
  BehaviorSubject,
  Observable,
  ReplaySubject,
  combineLatest,
  merge,
  of,
  scan,
  shareReplay,
  throwError,
} from "rxjs";
import {
  catchError,
  distinctUntilChanged,
  filter,
  map,
  switchMap,
  take,
} from "rxjs/operators";
import { SortCriteria } from "src/app/shared/components/sortable-header/sortable-header.component";
import { CoursesRestService } from "src/app/shared/services/courses-rest.service";
import { LoadingService } from "src/app/shared/services/loading-service";
import { Course, Grading } from "../../shared/models/course.model";
import { DropDownItem } from "../../shared/models/drop-down-item.model";
import {
  StudentGrade,
  StudentGradesSortKey,
  averageOfGradesForScale,
  compareFn,
  meanOf,
  pluckFinalGrades,
  transform,
} from "../../shared/models/student-grades";
import { Result, Test } from "../../shared/models/test.model";
import { GradingScalesRestService } from "../../shared/services/grading-scales-rest.service";
import { GradingsRestService } from "../../shared/services/gradings-rest.service";
import { SortService } from "../../shared/services/sort.service";
import { notNull } from "../../shared/utils/filter";
import { spread } from "../../shared/utils/function";
import { TestsAction, courseReducer } from "../utils/course-reducer";
import { canSetFinalGrade } from "../utils/events";
import { findResult, sortByDate } from "../utils/tests";

export interface TestsFilter {
  onlyMine: boolean;
  hidePublished: boolean;
}

export const INITIAL_TESTS_FILTER: TestsFilter = {
  onlyMine: false,
  hidePublished: false,
};

export type GradingScaleOptions = {
  [id: number]: DropDownItem[];
};

export type TestResultGradeUpdate = {
  studentId: number;
  testId: number;
  gradeId: Option<number>;
};

export type TestResultPointsUpdate = {
  studentId: number;
  testId: number;
  points: Option<number>;
};

@Injectable()
export class TestStateService {
  private coursesRestService = inject(CoursesRestService);
  private gradingScalesRestService = inject(GradingScalesRestService);
  private gradingsRestService = inject(GradingsRestService);
  private loadingService = inject(LoadingService);
  private sortService = inject<SortService<StudentGradesSortKey>>(SortService);

  private action$ = new ReplaySubject<TestsAction>(1);

  loading$ = this.loadingService.loading$;

  private _courseId$ = new ReplaySubject<number>(1);

  courseId$ = this._courseId$.asObservable();

  private fetchedCourse$ = this._courseId$.pipe(
    switchMap((courseId) =>
      this.loadingService.load(
        this.coursesRestService.getCourseWithTests(courseId),
      ),
    ),
    shareReplay(1),
  );

  course$: Observable<Course> = merge(
    this.action$,
    this.fetchedCourse$.pipe(
      filter(notNull),
      map(
        (payload) =>
          ({
            type: "reset",
            payload,
          }) as TestsAction,
      ),
    ),
  ).pipe(
    scan(courseReducer, null as Option<Course>),
    filter(notNull),
    shareReplay(1),
  );

  tests$ = this.course$.pipe(
    map((course: Course) => course.Tests || []),
    map(sortByDate),
  );
  hasTests$ = this.tests$.pipe(map((tests) => tests.length > 0));

  private filterSubject$ = new BehaviorSubject<TestsFilter>(
    INITIAL_TESTS_FILTER,
  );
  filter$ = this.filterSubject$.asObservable();

  private expandedHeaderSubject$ = new BehaviorSubject<boolean>(false);
  expandedHeader$ = this.expandedHeaderSubject$.asObservable();

  filteredTests$ = combineLatest([this.tests$, this.filter$]).pipe(
    map(([tests, filter]) =>
      tests.filter(
        (test) =>
          (!filter.onlyMine || test.IsOwner) &&
          (!filter.hidePublished || !test.IsPublished),
      ),
    ),
  );

  sortCriteria$ = this.sortService.sortCriteria$;
  sortCriteria = this.sortService.sortCriteria;

  studentGrades$ = combineLatest([
    this.course$,
    this.filteredTests$,
    this.sortCriteria$,
  ]).pipe(map(spread(this.toStudentGrades.bind(this))));

  canSetFinalGrade$ = this.course$.pipe(map(canSetFinalGrade));

  private gradingScaleIds$ = this.course$.pipe(
    map((course: Course) =>
      uniq(
        [
          ...(course.Tests ?? []).map((test: Test) => test.GradingScaleId),
          course.GradingScaleId,
        ].filter(notNull),
      ),
    ),
    distinctUntilChanged(isEqual),
    shareReplay(1),
  );

  private gradingScales$ = this.gradingScaleIds$.pipe(
    switchMap((ids) => this.gradingScalesRestService.getListForIds(ids)),
    shareReplay(1),
  );

  private UNDEFINED_GRADINGSCALE_ID = -1;
  private gradingScalesOptions$: Observable<GradingScaleOptions> =
    this.gradingScales$.pipe(
      map((gradingScales) =>
        gradingScales
          .map((gradingScale) => {
            const id = gradingScale?.Id || this.UNDEFINED_GRADINGSCALE_ID;
            const options =
              gradingScale?.Grades.map((gradeOption) => {
                return {
                  Key: gradeOption.Id,
                  Value: gradeOption.Designation,
                };
              }) || [];
            return {
              id,
              options,
            };
          })
          .reduce(
            (gradingScaleOptions, option) => ({
              ...gradingScaleOptions,
              [option.id]: option.options,
            }),
            {},
          ),
      ),
      shareReplay(1),
    );

  meanOfStudentGradesForCourse$: Observable<number> = this.studentGrades$.pipe(
    map((studentGrades) => meanOf(pluckFinalGrades(studentGrades))),
  );

  meanOfFinalGradesForCourse$: Observable<number | null> = combineLatest([
    this.gradingScalesOptions$,
    this.studentGrades$,
  ]).pipe(switchMap(spread(this.meanOfOverwrittenGradesForCourse.bind(this))));

  setCourseId(id: number) {
    this._courseId$.next(id);
  }

  reload() {
    this._courseId$.pipe(take(1)).subscribe((courseId) => {
      this.setCourseId(courseId);
    });
  }

  setFilter(filter: TestsFilter) {
    this.filterSubject$.next(filter);
  }

  gradingOptionsForTest$(test: Test) {
    return this.gradingOptions$(test.GradingScaleId);
  }

  gradingOptionsForCourse$() {
    return this.course$.pipe(
      switchMap((course: Course) =>
        this.gradingOptions$(course.GradingScaleId),
      ),
    );
  }

  toStudentGrades(
    course: Course,
    tests: ReadonlyArray<Test> = [],
    sortCriteria: Option<SortCriteria<StudentGradesSortKey>>,
  ): ReadonlyArray<StudentGrade> {
    const studentGrades = transform(
      course.Participants?.map((p) => ({ ...p, Id: p.PersonId })) ?? [],
      tests,
      course.Gradings ?? [],
      course.FinalGrades ?? [],
    );
    return sortCriteria
      ? studentGrades.sort(compareFn(sortCriteria, tests))
      : studentGrades;
  }

  toggleHeader(expanded: boolean) {
    this.expandedHeaderSubject$.next(expanded);
  }

  /**
   * Optimistically updates the local state before saving. Returns the original
   * value of the affected test result to be used with `saveGrade`, such that we
   * can revert back to this old value in case of an error.
   */
  optimisticallyUpdateGrade(
    update: TestResultGradeUpdate | TestResultPointsUpdate,
  ): Observable<Option<Result>> {
    return this.course$.pipe(
      take(1),
      map((course) => {
        // As a side-effect, optimistically update the local state with the new value
        const { originalResult, updatedResult } =
          this.buildOptimisticResultUpdate(course, update);
        this.updateTestResult(updatedResult, null);

        return originalResult;
      }),
    );
  }

  /**
   * Actually performs the request to persist the grade/points update. Will
   * revert back to `originalResult` if present and the request fails.
   */
  saveGrade(
    update: TestResultGradeUpdate | TestResultPointsUpdate,
    originalResult?: Option<Result>,
  ) {
    this.course$
      .pipe(
        take(1),
        switchMap((course) =>
          // Send the actual request to the API
          this.coursesRestService.updateTestResult(course.Id, update).pipe(
            catchError((error) => {
              // Revert the optimistic update back to the original value in case of an error
              if (originalResult) {
                this.updateTestResult({ ...originalResult }, null);
              }
              return throwError(() => error);
            }),
          ),
        ),
      )
      .subscribe(({ testResult, grading }) =>
        // Update the local state with the data from the response (including the
        // grading containing the average)
        this.updateOrDeleteTestResult(
          update.testId,
          update.studentId,
          testResult,
          grading,
          "gradeId" in update ? "grade" : "points",
        ),
      );
  }

  publish(test: Test) {
    this.coursesRestService
      .publishTest(test.Id)
      .subscribe(this.toggleTestPublishedState.bind(this));
  }

  unpublish(test: Test) {
    this.coursesRestService
      .unpublishTest(test.Id)
      .subscribe(this.toggleTestPublishedState.bind(this));
  }

  deleteTest(testId: number) {
    this.action$.next({ type: "delete-test", payload: testId });
  }

  overwriteFinalGrade({
    id,
    selectedGradeId,
  }: {
    id: number;
    selectedGradeId: Option<number>;
  }) {
    this.gradingsRestService.updateGrade(id, selectedGradeId).subscribe(() => {
      this.action$.next({
        type: "final-grade-overwritten",
        payload: { id, selectedGradeId },
      });
    });
  }

  setAveragesAsFinalGrades(courseIds: { CourseIds: number[] }) {
    this.coursesRestService
      .setAverageAsFinalGrade(courseIds)
      .subscribe((response) =>
        this.action$.next({
          type: "replace-grades",
          payload: response.Gradings,
        }),
      );
  }

  private buildOptimisticResultUpdate(
    course: Course,
    update: TestResultGradeUpdate | TestResultPointsUpdate,
  ): { originalResult: Option<Result>; updatedResult: Result } {
    const originalResult = findResult(course, update.testId, update.studentId);

    const updatedResult: Result = originalResult
      ? { ...originalResult }
      : // Dummy object for optimistic update, if no result object exists yet
        {
          Id: "",
          TestId: update.testId,
          StudentId: update.studentId,
          CourseRegistrationId: 0,
          GradeId: null,
          GradeValue: null,
          GradeDesignation: null,
          Points: null,
        };
    updatedResult.GradeId =
      "gradeId" in update ? update.gradeId : (originalResult?.GradeId ?? null);
    updatedResult.Points =
      "points" in update ? update.points : (originalResult?.Points ?? null);

    return { originalResult, updatedResult };
  }

  private updateOrDeleteTestResult(
    testId: number,
    studentId: number,
    testResult: Option<Result>,
    grading: Option<Grading>,
    ignore?: "grade" | "points",
  ): void {
    if (testResult) {
      this.updateTestResult(testResult, grading, ignore);
    } else {
      this.deleteTestResult(testId, studentId, grading);
    }
  }

  private updateTestResult(
    testResult: Result,
    grading?: Option<Grading>,
    ignore?: "grade" | "points",
  ): void {
    this.action$.next({
      type: "updateResult",
      payload: {
        testResult,
        grading: grading ?? null,
        ignore,
      },
    });
  }

  private deleteTestResult(
    testId: number,
    studentId: number,
    grading: Option<Grading>,
  ): void {
    this.action$.next({
      type: "deleteResult",
      payload: { testId, studentId, grading },
    });
  }

  private toggleTestPublishedState(testId: number): void {
    this.action$.next({
      type: "toggle-test-state",
      payload: testId,
    });
  }

  private gradingOptions$(gradingScaleId: number | null) {
    if (gradingScaleId === null) return of(null);
    return this.gradingScalesOptions$.pipe(
      map((gradingScaleOptions) => gradingScaleOptions[gradingScaleId]),
      shareReplay(1),
    );
  }

  private meanOfOverwrittenGradesForCourse(
    gradingScaleOptions: GradingScaleOptions,
    studentGrades: ReadonlyArray<StudentGrade>,
  ): Observable<number | null> {
    return this.course$.pipe(
      map((course: Course) => {
        if (course.GradingScaleId === null) return null;
        if (gradingScaleOptions[course.GradingScaleId] === undefined)
          return null;
        const scale = gradingScaleOptions[course.GradingScaleId];
        return averageOfGradesForScale(pluckFinalGrades(studentGrades), scale);
      }),
    );
  }
}
