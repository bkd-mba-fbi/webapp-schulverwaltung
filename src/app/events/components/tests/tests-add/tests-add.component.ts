import { AsyncPipe } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { Router } from "@angular/router";
import { TranslatePipe, TranslateService } from "@ngx-translate/core";
import { BehaviorSubject, finalize, switchMap, take } from "rxjs";
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TestsAddComponent {
  private courseService = inject(CoursesRestService);
  private toastService = inject(ToastService);
  private translate = inject(TranslateService);
  private router = inject(Router);
  private state = inject(TestStateService);

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
}
