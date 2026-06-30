import { DatePipe } from "@angular/common";
import { Component, inject, input } from "@angular/core";
import { toObservable, toSignal } from "@angular/core/rxjs-interop";
import { TranslatePipe } from "@ngx-translate/core";
import { map } from "rxjs";
import {
  deleteResultByStudentId,
  replaceResultInTest,
  resultOfStudent,
} from "src/app/events/utils/tests";
import { DropDownItem } from "src/app/shared/models/drop-down-item.model";
import { GradingScale } from "src/app/shared/models/grading-scale.model";
import { Result, Test } from "src/app/shared/models/test.model";
import { BkdModalService } from "src/app/shared/services/bkd-modal.service";
import { TestPointsPipe } from "../../../pipes/test-points.pipe";
import { TestsWeightPipe } from "../../../pipes/test-weight.pipe";
import { StudentGradesService } from "../../../services/student-grades.service";
import { StudentGradesEditDialogComponent } from "../student-grades-edit-dialog/student-grades-edit-dialog.component";

@Component({
  selector: "bkd-student-grades-test",
  template: `
    <!-- eslint-disable @angular-eslint/template/click-events-have-key-events -->
    <!-- eslint-disable @angular-eslint/template/interactive-supports-focus -->
    @let testEntry = test();

    @if (testEntry) {
      <div class="test-entry">
        <div class="designation" data-testid="test-designation">
          {{ testEntry.Designation }}
        </div>
        <div class="date" data-testid="test-date">
          {{ testEntry.Date | date: "dd.MM.yyyy" }}
        </div>
        <div class="grade">
          @if (isEditable() && testEntry.IsOwner) {
            <a
              class="btn btn-link"
              aria-label="edit grade"
              (click)="editGrading(testEntry)"
            >
              <i class="material-icons" data-testid="test-grade-edit-icon"
                >edit</i
              >
              <span data-testid="test-grade">{{ grading() }}</span>
            </a>
          } @else {
            <span data-testid="test-grade">{{ grading() }}</span>
          }
        </div>
        <div class="factor" data-testid="test-factor">
          {{ testEntry | bkdTestWeight }}
        </div>
        <div class="points" data-testid="test-points">
          <span>{{
            testEntry
              | bkdTestPoints
                : studentId()
                : isEditable()
                : "student.grades.points"
          }}</span>
        </div>
        <div class="teacher" data-testid="test-teacher">
          {{ testEntry.Owner }}
        </div>
        @if (isEditable()) {
          <div class="state" data-testid="test-status">
            {{
              (testEntry.IsPublished
                ? "tests.published"
                : "tests.not-published"
              ) | translate
            }}
          </div>
        }
      </div>
    }
  `,
  styleUrls: ["./student-grades-test.component.scss"],
  imports: [DatePipe, TranslatePipe, TestPointsPipe, TestsWeightPipe],
})
export class StudentGradesTestComponent {
  private gradeService = inject(StudentGradesService);
  private modalService = inject(BkdModalService);

  readonly test = input.required<Test>();
  readonly studentId = input.required<number>();
  readonly gradingScale = input<Option<GradingScale>>(null);
  readonly isEditable = input(false);

  grading = toSignal(
    toObservable(this.test).pipe(map(this.getGrading.bind(this))),
    { initialValue: null },
  );

  editGrading(test: Test): void {
    const modalRef = this.modalService.open(StudentGradesEditDialogComponent, {
      backdrop: "static", // prevent closing by click outside of modal
    });
    modalRef.componentInstance.test = test;
    modalRef.componentInstance.gradeId = this.getGradeId(test);
    modalRef.componentInstance.gradeOptions =
      StudentGradesTestComponent.mapToOptions(this.gradingScale());
    modalRef.componentInstance.studentId = this.studentId;
    modalRef.componentInstance.points = this.getPoints(test);

    modalRef.result.then(
      (result) => this.updateStudentGrade(result, test),
      () => {},
    );
  }

  private updateStudentGrade(result: Option<Result>, test: Test): void {
    const updatedTest = result
      ? replaceResultInTest(result, test)
      : deleteResultByStudentId(this.studentId(), test);
    this.gradeService.updateStudentCourses(updatedTest);
  }

  private getGrading(test: Test): string {
    return (
      this.gradingScale()?.Grades.find(
        (grade) => grade.Id === this.getGradeId(test),
      )?.Designation || "–"
    );
  }

  private getGradeId(test: Test): Option<number> {
    return resultOfStudent(this.studentId(), test)?.GradeId || null;
  }

  private getPoints(test: Test): Option<number> {
    return resultOfStudent(this.studentId(), test)?.Points || null;
  }

  private static mapToOptions(
    gradingScale: Option<GradingScale>,
  ): Option<DropDownItem[]> {
    return (
      gradingScale?.Grades.map((gradeOption) => {
        return {
          Key: gradeOption.Id,
          Value: gradeOption.Designation,
        };
      }) || null
    );
  }
}
