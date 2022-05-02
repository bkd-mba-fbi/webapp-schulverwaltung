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
import {
  Course,
  Grading,
  TestGradesResult,
  TestPointsResult,
  UpdatedTestResultResponse,
} from 'src/app/shared/models/course.model';
import { DropDownItem } from 'src/app/shared/models/drop-down-item.model';
import {
  averageOfGradesForScale,
  compareFn,
  meanOf,
  SortKeys,
  StudentGrade,
  transform,
} from 'src/app/shared/models/student-grades';
import { Result, Test } from 'src/app/shared/models/test.model';
import { GradingsRestService } from 'src/app/shared/services/gradings-rest.service';
import { Sorting, SortService } from 'src/app/shared/services/sort.service';
import { spread } from 'src/app/shared/utils/function';
import { CoursesRestService } from '../../shared/services/courses-rest.service';
import { GradingScalesRestService } from '../../shared/services/grading-scales-rest.service';
import { changeGrading, replaceGrading } from '../utils/gradings';
import { replaceResult, toggleIsPublished } from '../utils/tests';
import { uniq } from 'lodash-es';

export type Filter = 'all-tests' | 'my-tests';

export type GradingScaleOptions = {
  [id: number]: DropDownItem[];
};

type TestsAction =
  | { type: 'reset'; payload: Course }
  | {
      type: 'updateResult';
      payload: { testResult: Result; grading: Grading };
    }
  | { type: 'toggle-test-state'; payload: number }
  | {
      type: 'final-grade-overwritten';
      payload: { id: number; selectedGradeId: number };
    }
  | { type: 'replace-grades'; payload: Grading[] };

@Injectable({
  providedIn: 'root',
})
export class TestEditGradesStateService {
  private action$ = new ReplaySubject<TestsAction>(1);

  course$ = this.action$.pipe(
    scan((course, action) => {
      switch (action.type) {
        case 'updateResult':
          return {
            ...course,
            Tests: replaceResult(action.payload.testResult, course.Tests || []),
            Gradings: replaceGrading(
              action.payload.grading,
              course.Gradings || []
            ),
          };
        case 'reset':
          return action.payload;
        case 'toggle-test-state':
          return {
            ...course,
            Tests: toggleIsPublished(action.payload, course.Tests || []),
          };
        case 'final-grade-overwritten':
          return {
            ...course,
            Gradings: changeGrading(
              {
                id: action.payload.id,
                selectedGradeId: action.payload.selectedGradeId,
              },
              course.Gradings || []
            ),
          };
        case 'replace-grades': {
          return {
            ...course,
            Gradings: action.payload,
          };
        }
        default:
          return course;
      }
    }, {} as Course)
  );

  // TODO: this is a duplication from test list component
  tests$ = this.course$.pipe(
    map((course: Course) => course.Tests || []),
    map((tests: Test[]) => {
      return tests
        .slice()
        .sort((test1, test2) => test2.Date.getTime() - test1.Date.getTime());
    })
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

  private gradingScaleIds$ = this.course$.pipe(
    map((course: Course) =>
      uniq([
        ...(course.Tests ?? []).map((test: Test) => test.GradingScaleId),
        course.GradingScaleId,
      ])
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

  meanOfStudentGradesForCourse$: Observable<number> = this.studentGrades$.pipe(
    map((studentGrades) =>
      meanOf(studentGrades.map((studentGrade) => studentGrade.finalGrade))
    )
  );

  meanOfFinalGradesForCourse$: Observable<number | null> = combineLatest([
    this.gradingScalesOptions$,
    this.studentGrades$,
  ]).pipe(switchMap(spread(this.meanOfOverwrittenGradesForCourse.bind(this))));

  gradingOptionsForTest$(test: Test) {
    return this.gradingOptions$(test.GradingScaleId);
  }

  gradingOptionsForCourse$() {
    return this.course$.pipe(
      switchMap((course: Course) => this.gradingOptions$(course.GradingScaleId))
    );
  }

  setCourse(course: Course): void {
    this.action$.next({ type: 'reset', payload: course || [] });
  }

  toStudentGrades(
    course: Course,
    tests: Test[] = [],
    sorting: Sorting<SortKeys>
  ) {
    return transform(
      course.ParticipatingStudents ?? [],
      tests,
      course.Gradings ?? []
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
        switchMap((course: Course) =>
          this.courseRestService.updateTestResult(course, requestBody)
        )
      )
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
      this.action$.next({
        type: 'final-grade-overwritten',
        payload: { id, selectedGradeId },
      });
    });
  }

  setAveragesAsFinalGrades(courseIds: { CourseIds: number[] }) {
    this.courseRestService
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

  constructor(
    private sortService: SortService<SortKeys>,
    private courseRestService: CoursesRestService,
    private gradingScalesRestService: GradingScalesRestService,
    private gradingsRestService: GradingsRestService
  ) {}
}
