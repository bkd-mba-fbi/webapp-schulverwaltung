import { AsyncPipe, NgClass } from "@angular/common";
import { Component, inject } from "@angular/core";
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
})
export class TestsListComponent {
  settings = inject<Settings>(SETTINGS);
  state = inject(TestStateService);
  private translate = inject(TranslateService);

  selectTest$: Subject<number> = new Subject();

  testOptions$ = this.state.tests$.pipe(
    map((test) => [
      { Key: -1, Value: this.translate.instant("tests.grade") },
      ...test.map((test) => {
        return { Key: test.Id, Value: test.Designation };
      }),
    ]),
    distinctUntilChanged(),
  );

  selectedTestId$ = merge(
    this.selectTest$,
    this.state.tests$.pipe(
      take(1),
      map((tests) => tests[0]?.Id),
    ),
  ).pipe(distinctUntilChanged());

  selectedTest$: Observable<Test | undefined> = this.selectedTestId$.pipe(
    switchMap((id: number) =>
      this.state.tests$.pipe(
        map((tests) => tests.find((test) => test.Id === id)),
      ),
    ),
    distinctUntilChanged(),
  );

  testSelected(id: number) {
    this.selectTest$.next(id);
  }

  buildLinkToRatingOverview() {
    return this.state.course$.pipe(
      take(1),
      map((course) =>
        this.settings.eventlist["evaluation"].replace(":id", String(course.Id)),
      ),
    );
  }
}
