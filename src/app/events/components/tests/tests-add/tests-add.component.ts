import { AsyncPipe } from "@angular/common";
import { Component, inject } from "@angular/core";
import { Router } from "@angular/router";
import { TranslatePipe, TranslateService } from "@ngx-translate/core";
import sortBy from "lodash-es/sortBy";
import { BehaviorSubject, finalize, map, switchMap, take } from "rxjs";
import { Test } from "src/app/shared/models/test.model";
import { CoursesRestService } from "src/app/shared/services/courses-rest.service";
import { ToastService } from "../../../../shared/services/toast.service";
import { TestStateService } from "../../../services/test-state.service";
import {
  TestFormValue,
  TestsEditFormComponent,
} from "../tests-edit-form/tests-edit-form.component";

@Component({
  selector: "bkd-tests-add",
  templateUrl: "./tests-add.component.html",
  styleUrls: ["./tests-add.component.scss"],
  imports: [TestsEditFormComponent, AsyncPipe, TranslatePipe],
})
export class TestsAddComponent {
  private courseService = inject(CoursesRestService);
  private toastService = inject(ToastService);
  private translate = inject(TranslateService);
  private router = inject(Router);
  private state = inject(TestStateService);

  defaultGradingScaleId$ = this.state.tests$.pipe(
    map(this.getLatestGradingScaleId.bind(this)),
  );
  saving$ = new BehaviorSubject(false);

  save(value: TestFormValue): void {
    this.saving$.next(true);
    this.state.courseId$
      .pipe(
        take(1),
        switchMap((courseId) => this.courseService.add({ courseId, ...value })),
        finalize(() => this.saving$.next(false)),
      )
      .subscribe(this.onSaveSuccess.bind(this));
  }

  private onSaveSuccess(): void {
    // Make sure new test is reloaded before navigating back
    this.state.reload().subscribe(() => {
      this.toastService.success(
        this.translate.instant("tests.form.save-success"),
      );
      this.navigateBack();
    });
  }

  private navigateBack(): void {
    this.state.courseId$
      .pipe(take(1))
      .subscribe((id) => void this.router.navigate(["events", id, "tests"]));
  }

  /**
   * Returns the grading scale ID of the newest test owned by the current user.
   */
  private getLatestGradingScaleId(tests: ReadonlyArray<Test>): Option<number> {
    const own = tests.filter((t) => t.IsOwner);
    const newest = sortBy(own, (t) => t.Creation).reverse();
    return newest[0]?.GradingScaleId ?? null;
  }
}
