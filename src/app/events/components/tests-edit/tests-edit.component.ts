import { AsyncPipe } from "@angular/common";
import { Component, inject } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { TranslatePipe, TranslateService } from "@ngx-translate/core";
import {
  BehaviorSubject,
  combineLatest,
  distinctUntilChanged,
  finalize,
  map,
  switchMap,
} from "rxjs";
import { take } from "rxjs/operators";
import { Test } from "src/app/shared/models/test.model";
import { BkdModalService } from "src/app/shared/services/bkd-modal.service";
import { CoursesRestService } from "src/app/shared/services/courses-rest.service";
import { SpinnerComponent } from "../../../shared/components/spinner/spinner.component";
import { ToastService } from "../../../shared/services/toast.service";
import { TestStateService } from "../../services/test-state.service";
import { TestsEditFormComponent } from "../tests-edit-form/tests-edit-form.component";
import { TestsDeleteComponent } from "./tests-delete/tests-delete.component";

@Component({
  selector: "bkd-tests-edit",
  templateUrl: "./tests-edit.component.html",
  styleUrls: ["./tests-edit.component.scss"],
  imports: [TestsEditFormComponent, SpinnerComponent, AsyncPipe, TranslatePipe],
})
export class TestsEditComponent {
  state = inject(TestStateService);
  private courseService = inject(CoursesRestService);
  private route = inject(ActivatedRoute);
  private toastService = inject(ToastService);
  private translate = inject(TranslateService);
  private router = inject(Router);
  private modalService = inject(BkdModalService);

  saving$ = new BehaviorSubject(false);

  private testId$ = this.route.paramMap.pipe(
    map((params) => Number(params.get("testId"))),
    distinctUntilChanged(),
  );

  test$ = combineLatest([this.state.tests$, this.testId$]).pipe(
    map(([tests, id]) => tests.find((t) => t.Id === id)),
  );

  openDeleteModal(test: Test) {
    const modalRef = this.modalService.open(TestsDeleteComponent);
    modalRef.componentInstance.test = test;
    modalRef.result.then(
      (result) => {
        if (result) {
          this.courseService
            .delete(test.CourseId, test.Id)
            .subscribe(this.onDeleteSuccess.bind(this));
        }
      },
      () => {},
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  save(formGroupValue: Dict<any>): void {
    this.saving$.next(true);
    const {
      designation,
      date,
      weight,
      isPointGrading,
      maxPoints,
      maxPointsAdjusted,
    } = formGroupValue;
    combineLatest([this.state.courseId$, this.testId$])
      .pipe(
        take(1),
        switchMap(([courseId, testId]) =>
          this.courseService.update(
            courseId,
            testId,
            designation,
            date,
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
    this.toastService.success(
      this.translate.instant("tests.form.save-success"),
    );
    this.navigateBack();
  }

  private onDeleteSuccess(deletedTestId: number): void {
    this.toastService.success(
      this.translate.instant("tests.form.delete-success"),
    );
    this.state.deleteTest(deletedTestId);
    this.navigateBack();
  }

  private navigateBack(): void {
    this.state.courseId$
      .pipe(take(1))
      .subscribe((id) => void this.router.navigate(["events", id, "tests"]));
  }
}
