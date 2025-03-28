import { AsyncPipe } from "@angular/common";
import { Component, inject } from "@angular/core";
import { Router } from "@angular/router";
import { TranslatePipe, TranslateService } from "@ngx-translate/core";
import { BehaviorSubject, finalize, switchMap, take } from "rxjs";
import { CoursesRestService } from "src/app/shared/services/courses-rest.service";
import { ToastService } from "../../../../shared/services/toast.service";
import { TestStateService } from "../../../services/test-state.service";
import { TestsEditFormComponent } from "../tests-edit-form/tests-edit-form.component";

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

  saving$ = new BehaviorSubject(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  save(formGroupValue: any): void {
    this.saving$.next(true);
    const {
      designation,
      date,
      weight,
      isPointGrading,
      maxPoints,
      maxPointsAdjusted,
    } = formGroupValue;
    this.state.courseId$
      .pipe(
        take(1),
        switchMap((courseId) =>
          this.courseService.add(
            courseId,
            date,
            designation,
            weight,
            isPointGrading,
            maxPoints,
            maxPointsAdjusted,
          ),
        ),
        finalize(() => this.saving$.next(false)),
      )
      .subscribe(this.onSaveSuccess.bind(this));
  }

  private onSaveSuccess(): void {
    // Make sure new test is displayed
    this.state.reload();

    this.toastService.success(
      this.translate.instant("tests.form.save-success"),
    );
    this.navigateBack();
  }

  private navigateBack(): void {
    this.state.courseId$
      .pipe(take(1))
      .subscribe((id) => void this.router.navigate(["events", id, "tests"]));
  }
}
