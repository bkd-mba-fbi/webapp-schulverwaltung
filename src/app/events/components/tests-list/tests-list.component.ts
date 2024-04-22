import { AsyncPipe, NgClass, NgIf } from "@angular/common";
import { Component, Inject } from "@angular/core";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { Observable, Subject, merge } from "rxjs";
import { distinctUntilChanged, map, switchMap, take } from "rxjs/operators";
import { Test } from "src/app/shared/models/test.model";
import { SETTINGS, Settings } from "../../../settings";
import { SelectComponent } from "../../../shared/components/select/select.component";
import { SpinnerComponent } from "../../../shared/components/spinner/spinner.component";
import { LetDirective } from "../../../shared/directives/let.directive";
import { TestStateService } from "../../services/test-state.service";
import { TestEditGradesComponent } from "../test-edit-grades/test-edit-grades.component";
import { TestsHeaderComponent } from "../tests-header/tests-header.component";

@Component({
  selector: "bkd-tests-list",
  templateUrl: "./tests-list.component.html",
  styleUrls: ["./tests-list.component.scss"],
  standalone: true,
  imports: [
    LetDirective,
    NgIf,
    TestsHeaderComponent,
    SelectComponent,
    TestEditGradesComponent,
    NgClass,
    SpinnerComponent,
    AsyncPipe,
    TranslateModule,
  ],
})
export class TestsListComponent {
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

  constructor(
    @Inject(SETTINGS) public settings: Settings,
    public state: TestStateService,
    private translate: TranslateService,
  ) {}

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
