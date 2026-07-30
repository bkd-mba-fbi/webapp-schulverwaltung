import { AsyncPipe, NgClass } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { RouterLink } from "@angular/router";
import { TranslatePipe, TranslateService } from "@ngx-translate/core";
import { Observable, Subject, merge } from "rxjs";
import { distinctUntilChanged, map, switchMap, take } from "rxjs/operators";
import { Test } from "src/app/shared/models/test.model";
import { SETTINGS, Settings } from "../../../../settings";
import { SelectComponent } from "../../../../shared/components/select/select.component";
import { SpinnerComponent } from "../../../../shared/components/spinner/spinner.component";
import { TestStateService } from "../../../services/test-state.service";
import { TestsHeaderComponent } from "../tests-header/tests-header.component";
import { TestsTableComponent } from "../tests-table/tests-table.component";

@Component({
  selector: "bkd-tests-list",
  templateUrl: "./tests-list.component.html",
  styleUrls: ["./tests-list.component.scss"],
  imports: [
    TestsHeaderComponent,
    SelectComponent,
    TestsTableComponent,
    NgClass,
    SpinnerComponent,
    AsyncPipe,
    TranslatePipe,
    RouterLink,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TestsListComponent {
  private readonly settings = inject<Settings>(SETTINGS);
  protected readonly state = inject(TestStateService);
  private readonly translate = inject(TranslateService);

  private readonly selectTest$: Subject<number> = new Subject();

  protected testOptions$ = this.state.tests$.pipe(
    map((test) => [
      { Key: -1, Value: this.translate.instant("tests.grade") },
      ...test.map((test) => {
        return { Key: test.Id, Value: test.Designation };
      }),
    ]),
    distinctUntilChanged(),
  );

  protected selectedTestId$ = merge(
    this.selectTest$,
    this.state.tests$.pipe(
      take(1),
      map((tests) => tests[0]?.Id),
    ),
  ).pipe(distinctUntilChanged());

  protected selectedTest$: Observable<Test | undefined> =
    this.selectedTestId$.pipe(
      switchMap((id: number) =>
        this.state.tests$.pipe(
          map((tests) => tests.find((test) => test.Id === id)),
        ),
      ),
      distinctUntilChanged(),
    );

  protected testSelected(id: number) {
    this.selectTest$.next(id);
  }
}
