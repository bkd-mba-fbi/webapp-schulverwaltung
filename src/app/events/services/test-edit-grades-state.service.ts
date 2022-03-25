import { Injectable } from '@angular/core';
import { console } from 'fp-ts';
import { cons } from 'fp-ts/lib/ReadonlyNonEmptyArray';
import { BehaviorSubject, combineLatest, map, Observable, tap } from 'rxjs';
import { Course } from 'src/app/shared/models/course.model';
import {
  compareFn,
  SortKeys,
  transform,
} from 'src/app/shared/models/student-grades';
import { Test } from 'src/app/shared/models/test.model';
import { Sorting, SortService } from 'src/app/shared/services/sort.service';
import { spread } from 'src/app/shared/utils/function';

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

  tests$: Observable<Test[] | undefined> = this.filter$.pipe(
    map((filter) =>
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
    console.log(expanded);
    this.expandedHeader$.next(expanded);
  }

  constructor(private sortService: SortService<SortKeys>) {}
}
