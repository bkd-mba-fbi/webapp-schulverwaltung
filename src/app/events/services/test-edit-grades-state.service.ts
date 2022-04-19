import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  combineLatest,
  map,
  Observable,
  startWith,
  Subject,
} from 'rxjs';
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
import { Test } from 'src/app/shared/models/test.model';
import { Sorting, SortService } from 'src/app/shared/services/sort.service';
import { spread } from 'src/app/shared/utils/function';
import { CoursesRestService } from '../../shared/services/courses-rest.service';
import { replaceResult } from '../utils/tests';

export type Filter = 'all-tests' | 'my-tests';

@Injectable({
  providedIn: 'root',
})
export class TestEditGradesStateService {
  course: Course;
  tests: Test[];

  filter$: BehaviorSubject<Filter> = new BehaviorSubject<Filter>('all-tests');

  expandedHeader$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  private newTests$: Subject<void> = new Subject();

  tests$: Observable<Test[] | undefined> = combineLatest([
    this.filter$,
    this.newTests$.pipe(startWith(undefined)),
  ]).pipe(
    map(([filter, _]) =>
      this.tests.filter((test) => {
        if (filter === 'all-tests') {
          return true;
        } else {
          return test.IsOwner;
        }
      })
    )
  );

  sorting$ = this.sortService.sorting$;

  studentGrades$ = combineLatest([this.tests$, this.sorting$]).pipe(
    map(spread(this.toStudentGrades.bind(this)))
  );

  constructor(
    private sortService: SortService<SortKeys>,
    private courseRestService: CoursesRestService
  ) {}

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

  private updateStudentGrades(newGrades: UpdatedTestResultResponse) {
    this.tests = replaceResult(newGrades.TestResults[0], this.tests);
    this.newTests$.next();
  }
}
