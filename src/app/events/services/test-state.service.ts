import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  combineLatest,
  merge,
  Observable,
  ReplaySubject,
  scan,
  shareReplay,
} from 'rxjs';
import { CoursesRestService } from 'src/app/shared/services/courses-rest.service';
import { LoadingService } from 'src/app/shared/services/loading-service';
import { filter, map, switchMap, take } from 'rxjs/operators';
import {
  Course,
  TestGradesResult,
  TestPointsResult,
  UpdatedTestResultResponse,
} from '../../shared/models/course.model';
import { notNull } from '../../shared/utils/filter';
import { courseReducer, TestsAction } from '../utils/course-reducer';
import { Test } from '../../shared/models/test.model';
import { spread } from '../../shared/utils/function';
import { uniq } from 'lodash-es';
import {
  averageOfGradesForScale,
  compareFn,
  meanOf,
  SortKeys,
  StudentGrade,
  transform,
} from '../../shared/models/student-grades';
import { Sorting, SortService } from '../../shared/services/sort.service';
import { GradingScalesRestService } from '../../shared/services/grading-scales-rest.service';
import { GradingsRestService } from '../../shared/services/gradings-rest.service';
import { DropDownItem } from '../../shared/models/drop-down-item.model';
import { canSetFinalGrade } from '../utils/events';
import { sortByDate } from '../utils/tests';

export type Filter = 'all-tests' | 'my-tests';

export type GradingScaleOptions = {
  [id: number]: DropDownItem[];
};

@Injectable()
export class TestStateService {
  private action$ = new ReplaySubject<TestsAction>(1);

  loading$ = this.loadingService.loading$;

  private _courseId$ = new ReplaySubject<number>(1);

  courseId$ = this._courseId$.asObservable();

  private fetchedCourse$ = this._courseId$.pipe(
    switchMap((courseId) =>
      this.loadingService.load(
        this.coursesRestService.getExpandedCourse(courseId)
      )
    ),
    shareReplay(1)
  );

  course$: Observable<Course> = merge(this.action$, this.fetchedCourse$).pipe(
    map<TestsAction | Course, TestsAction>((actionOrFetchedCourse) => {
      if ('type' in actionOrFetchedCourse) {
        return actionOrFetchedCourse;
      }
      return {
        type: 'reset',
        payload: actionOrFetchedCourse,
      };
    }),
    scan(courseReducer, null as Option<Course>),
    filter(notNull)
  );

  tests$ = this.course$.pipe(
    map((course: Course) => course.Tests || []),
    map(sortByDate)
  );

  filter$: BehaviorSubject<Filter> = new BehaviorSubject<Filter>('all-tests');

  expandedHeader$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  filteredTests$ = combineLatest([this.tests$, this.filter$]).pipe(
    map(([tests, filter]) =>
      tests.filter((test) => {
        if (filter === 'all-tests') {
          return true;
        } else {
          return test.IsOwner;
        }
      })
    )
  );

  sorting$ = this.sortService.sorting$;

  studentGrades$ = combineLatest([
    this.course$,
    this.filteredTests$,
    this.sorting$,
  ]).pipe(map(spread(this.toStudentGrades.bind(this))));

  canSetFinalGrade$ = this.course$.pipe(map(canSetFinalGrade));

  private gradingScaleIds$ = this.course$.pipe(
    map((course: Course) =>
      uniq([
        ...(course.Tests ?? []).map((test: Test) => test.GradingScaleId),
        course.GradingScaleId,
      ])
    )
  );

  private gradingScales$ = this.gradingScalesRestService.loadGradingScales(
    this.gradingScaleIds$
  );

  private gradingScalesOptions$: Observable<GradingScaleOptions> = this.gradingScales$.pipe(
    map((gradingScales) =>
      gradingScales
        .map((gradingScale) => {
          return {
            id: gradingScale.Id,
            options: gradingScale.Grades.map((gradeOption) => {
              return {
                Key: gradeOption.Id,
                Value: gradeOption.Designation,
              };
            }),
          };
        })
        .reduce(
          (gradingScaleOptions, option) => ({
            ...gradingScaleOptions,
            [option.id]: option.options,
          }),
          {}
        )
    ),
    shareReplay(1)
  );

  meanOfStudentGradesForCourse$: Observable<number> = this.studentGrades$.pipe(
    map((studentGrades) =>
      meanOf(studentGrades.map((studentGrade) => studentGrade.finalGrade))
    )
  );

  meanOfFinalGradesForCourse$: Observable<number | null> = combineLatest([
    this.gradingScalesOptions$,
    this.studentGrades$,
  ]).pipe(switchMap(spread(this.meanOfOverwrittenGradesForCourse.bind(this))));

  constructor(
    private coursesRestService: CoursesRestService,
    private gradingScalesRestService: GradingScalesRestService,
    private gradingsRestService: GradingsRestService,
    private loadingService: LoadingService,
    private sortService: SortService<SortKeys>
  ) {}

  setCourseId(id: number) {
    this._courseId$.next(id);
  }

  gradingOptionsForTest$(test: Test) {
    return this.gradingOptions$(test.GradingScaleId);
  }

  gradingOptionsForCourse$() {
    return this.course$.pipe(
      switchMap((course: Course) => this.gradingOptions$(course.GradingScaleId))
    );
  }

  toStudentGrades(
    course: Course,
    tests: Test[] = [],
    sorting: Sorting<SortKeys>
  ): StudentGrade[] {
    return transform(
      course.ParticipatingStudents ?? [],
      tests,
      course.Gradings ?? [],
      course.FinalGrades ?? []
    ).sort(compareFn(sorting));
  }

  setSorting(sorting: Sorting<SortKeys>) {
    this.sortService.setSorting(sorting);
  }

  getSortingChar$(columnName: SortKeys) {
    return this.sortService.getSortingChar$(columnName);
  }

  sortBy(columnName: SortKeys) {
    this.sortService.toggleSorting(columnName);
  }

  toggleHeader(expanded: boolean) {
    this.expandedHeader$.next(expanded);
  }

  saveGrade(requestBody: TestGradesResult | TestPointsResult) {
    this.course$
      .pipe(
        take(1),
        switchMap((course: Course) =>
          this.coursesRestService.updateTestResult(course.Id, requestBody)
        )
      )
      .subscribe((response) => this.updateStudentGrades(response));
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
    this.action$.next({ type: 'delete-test', payload: testId });
  }

  overwriteFinalGrade({
    id,
    selectedGradeId,
  }: {
    id: number;
    selectedGradeId: number;
  }) {
    this.gradingsRestService.updateGrade(id, selectedGradeId).subscribe(() => {
      this.action$.next({
        type: 'final-grade-overwritten',
        payload: { id, selectedGradeId },
      });
    });
  }

  setAveragesAsFinalGrades(courseIds: { CourseIds: number[] }) {
    this.coursesRestService
      .setAverageAsFinalGrade(courseIds)
      .subscribe((response) =>
        this.action$.next({
          type: 'replace-grades',
          payload: response.Gradings,
        })
      );
  }

  private updateStudentGrades(newGrades: UpdatedTestResultResponse) {
    this.action$.next({
      type: 'updateResult',
      payload: {
        testResult: newGrades.TestResults[0],
        grading: newGrades.Gradings[0],
      },
    });
  }

  private toggleTestPublishedState(testId: number) {
    this.action$.next({
      type: 'toggle-test-state',
      payload: testId,
    });
  }

  private gradingOptions$(gradingScaleId: number) {
    return this.gradingScalesOptions$.pipe(
      map((gradingScaleOptions) => gradingScaleOptions[gradingScaleId]),
      shareReplay(1)
    );
  }

  private meanOfOverwrittenGradesForCourse(
    gradingScaleOptions: GradingScaleOptions,
    studentGrades: StudentGrade[]
  ): Observable<number | null> {
    return this.course$.pipe(
      map((course: Course) => {
        if (gradingScaleOptions[course.GradingScaleId] === undefined)
          return null;
        const scale = gradingScaleOptions[course.GradingScaleId]!;
        const finalGrades = studentGrades.map(
          (studentGrade) => studentGrade.finalGrade
        );
        return averageOfGradesForScale(finalGrades, scale);
      })
    );
  }
}
