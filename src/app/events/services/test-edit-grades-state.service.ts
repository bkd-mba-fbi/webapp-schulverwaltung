import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  combineLatest,
  forkJoin,
  map,
  Observable,
  ReplaySubject,
  scan,
  shareReplay,
  switchMap,
} from 'rxjs';
import { take } from 'rxjs/operators';
import {
  Course,
  TestGradesResult,
  TestPointsResult,
  UpdatedTestResultResponse,
} from 'src/app/shared/models/course.model';
import { DropDownItem } from 'src/app/shared/models/drop-down-item.model';
import {
  compareFn,
  meanOf,
  meanOfGradesFromScale,
  SortKeys,
  StudentGrade,
  transform,
} from 'src/app/shared/models/student-grades';
import { Result, Test } from 'src/app/shared/models/test.model';
import { Sorting, SortService } from 'src/app/shared/services/sort.service';
import { spread } from 'src/app/shared/utils/function';
import { CoursesRestService } from '../../shared/services/courses-rest.service';
import { GradingScalesRestService } from '../../shared/services/grading-scales-rest.service';
import { replaceResult, toggleIsPublished } from '../utils/tests';
import { GradingScale } from 'src/app/shared/models/grading-scale.model';
import { sum } from 'lodash-es';
import { average } from 'src/app/shared/utils/math';
import { GradingsRestService } from 'src/app/shared/services/gradings-rest.service';

export type Filter = 'all-tests' | 'my-tests';

export type GradingScaleOptions = {
  [id: number]: DropDownItem[];
};

type TestsAction =
  | { type: 'reset'; payload: Test[] }
  | { type: 'updateResult'; payload: Result }
  | { type: 'toggle-test-state'; payload: number };

@Injectable({
  providedIn: 'root',
})
export class TestEditGradesStateService {
  course: Course;

  action$ = new ReplaySubject<TestsAction>(1);

  tests$ = this.action$.pipe(
    scan((tests, action) => {
      switch (action.type) {
        case 'updateResult':
          return replaceResult(action.payload, tests);
        case 'reset':
          return action.payload;
        case 'toggle-test-state':
          return toggleIsPublished(action.payload, tests);
        default:
          return tests;
      }
    }, [] as Test[])
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

  studentGrades$ = combineLatest([this.filteredTests$, this.sorting$]).pipe(
    map(spread(this.toStudentGrades.bind(this)))
  );

  meanOfStudentGradesForCourse$: Observable<number> = this.studentGrades$.pipe(
    map((studentGrades) =>
      meanOf(studentGrades.map((studentGrade) => studentGrade.finalGrade))
    )
  );

  private meanOfOverwrittenGradesForCourse(
    gradingScaleOptions: GradingScaleOptions,
    studentGrades: StudentGrade[]
  ) {
    if (gradingScaleOptions[this.course.GradingScaleId] === undefined)
      return -1;
    const scale = gradingScaleOptions[this.course.GradingScaleId]!;
    const finalGrades = studentGrades.map(
      (studentGrade) => studentGrade.finalGrade
    );

    return meanOfGradesFromScale(scale, finalGrades);
  }

  private gradingScaleIds$ = this.tests$.pipe(
    take(1),
    map((tests: Test[]) =>
      [
        ...tests.map((test: Test) => test.GradingScaleId),
        this.course.GradingScaleId,
      ].filter((value, index, array) => array.indexOf(value) === index)
    )
  );

  private gradingScales$ = this.gradingScaleIds$.pipe(
    switchMap((ids) =>
      forkJoin(
        ids.map((id) => this.gradingScalesRestService.getGradingScale(id))
      )
    ),
    shareReplay(1)
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

  meanOfOverwrittenGradesForCourse$: Observable<number> = combineLatest([
    this.gradingScalesOptions$,
    this.studentGrades$,
  ]).pipe(map(spread(this.meanOfOverwrittenGradesForCourse.bind(this))));

  gradingOptionsForTest$(test: Test) {
    return this.gradingOptions$(test.GradingScaleId);
  }

  gradingOptionsForCourse$() {
    return this.gradingOptions$(this.course.GradingScaleId);
  }

  constructor(
    private sortService: SortService<SortKeys>,
    private courseRestService: CoursesRestService,
    private gradingScalesRestService: GradingScalesRestService,
    private gradingsRestService: GradingsRestService
  ) {}

  setTests(tests: Test[]): void {
    this.action$.next({ type: 'reset', payload: tests });
  }

  toStudentGrades(tests: Test[] = [], sorting: Sorting<SortKeys>) {
    return transform(
      this.course.ParticipatingStudents ?? [],
      tests,
      this.course.Gradings ?? []
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
    this.courseRestService
      .updateTestResult(this.course, requestBody)
      .subscribe((response) => this.updateStudentGrades(response));
  }

  publish(test: Test) {
    this.courseRestService
      .publishTest(test.Id)
      .subscribe(this.toggleTestPublishedState.bind(this));
  }

  unpublish(test: Test) {
    this.courseRestService
      .unpublishTest(test.Id)
      .subscribe(this.toggleTestPublishedState.bind(this));
  }

  overwriteFinalGrade({
    id,
    selectedGradeId,
  }: {
    id: number;
    selectedGradeId: number;
  }) {
    this.gradingsRestService.updateGrade(id, selectedGradeId).subscribe(() => {
      // do nothing for now...
    });
  }

  private updateStudentGrades(newGrades: UpdatedTestResultResponse) {
    this.action$.next({
      type: 'updateResult',
      payload: newGrades.TestResults[0],
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
}
