import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { merge, Observable, Subject } from 'rxjs';
import { distinctUntilChanged, map, switchMap, first } from 'rxjs/operators';
import { Test } from 'src/app/shared/models/test.model';
import { TestStateService } from '../../services/test-state.service';

@Component({
  selector: 'erz-tests-list',
  templateUrl: './tests-list.component.html',
  styleUrls: ['./tests-list.component.scss'],
})
export class TestsListComponent {
  selectTest$: Subject<number> = new Subject();

  courseId$: Observable<number> = this.route.paramMap.pipe(
    map((params) => Number(params.get('id'))),
    distinctUntilChanged()
  );

  course$ = this.courseId$.pipe(
    switchMap((id) => this.state.getCourse(id)),
    distinctUntilChanged()
  );

  tests$: Observable<Test[]> = this.course$.pipe(
    map((course) => course.Tests ?? []),
    distinctUntilChanged()
  );

  testOptions$ = this.tests$.pipe(
    map((test) =>
      test.map((test) => {
        return { Key: test.Id, Value: test.Designation };
      })
    ),
    distinctUntilChanged()
  );

  selectedTestId$ = merge(
    this.selectTest$,
    this.tests$.pipe(map((tests) => tests[0]?.Id))
  ).pipe(distinctUntilChanged());

  selectedTest$ = this.selectedTestId$.pipe(
    switchMap((id) =>
      this.tests$.pipe(map((tests) => tests.find((test) => test.Id === id)))
    ),
    distinctUntilChanged()
  );

  constructor(public state: TestStateService, private route: ActivatedRoute) {}

  testSelected(id: number) {
    this.selectTest$.next(id);
  }
}
