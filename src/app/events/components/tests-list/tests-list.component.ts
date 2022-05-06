import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { merge, Observable, Subject } from 'rxjs';
import { distinctUntilChanged, map, switchMap } from 'rxjs/operators';
import { Test } from 'src/app/shared/models/test.model';
import { TestStateService } from '../../services/test-state.service';

@Component({
  selector: 'erz-tests-list',
  templateUrl: './tests-list.component.html',
  styleUrls: ['./tests-list.component.scss'],
})
export class TestsListComponent {
  selectTest$: Subject<number> = new Subject();

  testOptions$ = this.state.tests$.pipe(
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
    this.state.tests$.pipe(map((tests) => tests[0]?.Id))
  ).pipe(distinctUntilChanged());

  selectedTest$: Observable<Test | undefined> = this.selectedTestId$.pipe(
    switchMap((id: number) =>
      this.state.tests$.pipe(
        map((tests) => tests.find((test) => test.Id === id))
      )
    ),
    distinctUntilChanged()
  );

  constructor(
    public state: TestStateService,
    private translate: TranslateService
  ) {}

  testSelected(id: number) {
    this.selectTest$.next(id);
  }
}
