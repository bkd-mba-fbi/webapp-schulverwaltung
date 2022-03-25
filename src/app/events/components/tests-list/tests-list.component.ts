import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { merge, Observable, shareReplay, Subject } from 'rxjs';
import { distinctUntilChanged, map, switchMap } from 'rxjs/operators';
import { Course } from 'src/app/shared/models/course.model';
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
    shareReplay(1)
  );

  tests$: Observable<Test[]> = this.course$.pipe(
    map((course: Course) => course.Tests ?? []),
    map((tests: Test[]) => {
      return tests
        .slice()
        .sort((test1, test2) => test2.Date.getTime() - test1.Date.getTime());
    }),
    distinctUntilChanged()
  );

  testOptions$ = this.tests$.pipe(
    map((test) => [
      { Key: -1, Value: this.translate.instant('tests.grade') },
      ...test.map((test) => {
        return { Key: test.Id, Value: test.Designation };
      }),
    ]),
    distinctUntilChanged()
  );

  selectedTestId$ = merge(
    this.selectTest$,
    this.tests$.pipe(map((tests) => tests[0]?.Id))
  ).pipe(distinctUntilChanged());

  selectedTest$: Observable<Test | undefined> = this.selectedTestId$.pipe(
    switchMap((id: number) =>
      this.tests$.pipe(map((tests) => tests.find((test) => test.Id === id)))
    ),
    distinctUntilChanged()
  );

  constructor(
    public state: TestStateService,
    private translate: TranslateService,
    private route: ActivatedRoute
  ) {}

  testSelected(id: number) {
    this.selectTest$.next(id);
  }
}
