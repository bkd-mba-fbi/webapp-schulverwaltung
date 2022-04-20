import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, map, ReplaySubject, scan } from 'rxjs';
import {
  Course,
  TestPointsResult,
  UpdatedTestResultResponse,
} from 'src/app/shared/models/course.model';
import {
  compareFn,
  SortKeys,
  transform,
} from 'src/app/shared/models/student-grades';
import { Result, Test } from 'src/app/shared/models/test.model';
import { Sorting, SortService } from 'src/app/shared/services/sort.service';
import { spread } from 'src/app/shared/utils/function';
import { CoursesRestService } from '../../shared/services/courses-rest.service';
import { replaceResult } from '../utils/tests';

export type Filter = 'all-tests' | 'my-tests';
type TestsAction =
  | { type: 'reset'; payload: Test[] }
  | { type: 'updateResult'; payload: Result };

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

  constructor(
    private sortService: SortService<SortKeys>,
    private courseRestService: CoursesRestService
  ) {}

  setTests(tests: Test[]): void {
    this.action$.next({ type: 'reset', payload: tests });
  }

  toStudentGrades(tests: Test[] = [], sorting: Sorting<SortKeys>) {
    return transform(this.course.ParticipatingStudents ?? [], tests).sort(
      compareFn(sorting)
    );
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

  savePoints(requestBody: TestPointsResult) {
    this.courseRestService
      .updateTestResult(this.course, requestBody)
      .subscribe((response) => this.updateStudentGrades(response));
  }

  publish(test: Test) {
    this.courseRestService.publishTest(test.Id).subscribe(() => {});
  }

  unpublish(test: Test) {
    this.courseRestService.unpublishTest(test.Id).subscribe(() => {});
  }

  private updateStudentGrades(newGrades: UpdatedTestResultResponse) {
    this.action$.next({
      type: 'updateResult',
      payload: newGrades.TestResults[0],
    });
  }
}
