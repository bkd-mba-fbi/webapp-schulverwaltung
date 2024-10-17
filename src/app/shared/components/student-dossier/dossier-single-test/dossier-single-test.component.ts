import { AsyncPipe, DatePipe } from "@angular/common";
import { Component, Input, OnChanges, SimpleChanges } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";
import { ReplaySubject, map } from "rxjs";
import {
  replaceResultInTest,
  resultOfStudent,
} from "src/app/events/utils/tests";
import { DropDownItem } from "src/app/shared/models/drop-down-item.model";
import { GradingScale } from "src/app/shared/models/grading-scale.model";
import { Result, Test } from "src/app/shared/models/test.model";
import { BkdModalService } from "src/app/shared/services/bkd-modal.service";
import { TestPointsPipe } from "../../../pipes/test-points.pipe";
import { TestsWeightPipe } from "../../../pipes/test-weight.pipe";
import { DossierGradesService } from "../../../services/dossier-grades.service";
import { DossierGradesEditComponent } from "../dossier-grades-edit/dossier-grades-edit.component";

@Component({
  selector: "bkd-dossier-single-test",
  template: `
    <!-- eslint-disable @angular-eslint/template/click-events-have-key-events -->
    <!-- eslint-disable @angular-eslint/template/interactive-supports-focus -->
    @let test = test$ | async;
    @let grading = grading$ | async;

    @if (test) {
      <div class="test-entry">
        <div class="designation" data-testid="test-designation">
          {{ test.Designation }}
        </div>
        <div class="date" data-testid="test-date">
          {{ test.Date | date: "dd.MM.yyyy" }}
        </div>
        <div class="grade">
          @if (isEditable && test.IsOwner) {
            <a
              class="btn btn-link"
              aria-label="edit grade"
              (click)="editGrading(test)"
            >
              <i class="material-icons" data-testid="test-grade-edit-icon"
                >edit</i
              >
              <span data-testid="test-grade">{{ grading }}</span>
            </a>
          } @else {
            <span data-testid="test-grade">{{ grading }}</span>
          }
        </div>
        <div class="factor" data-testid="test-factor">
          {{ test | bkdTestWeight }}
        </div>
        <div class="points" data-testid="test-points">
          <span>{{
            test | bkdTestPoints: studentId : isEditable : "dossier.points"
          }}</span>
        </div>
        <div class="teacher" data-testid="test-teacher">
          {{ test.Owner }}
        </div>
        @if (isEditable) {
          <div class="state" data-testid="test-status">
            {{
              (test.IsPublished ? "tests.published" : "tests.not-published")
                | translate
            }}
          </div>
        }
      </div>
    }
  `,
  styleUrls: ["./dossier-single-test.component.scss"],
  standalone: true,
  imports: [
    AsyncPipe,
    DatePipe,
    TranslateModule,
    TestPointsPipe,
    TestsWeightPipe,
  ],
})
export class DossierSingleTestComponent implements OnChanges {
  @Input() test: Test;
  @Input() studentId: number;
  @Input() gradingScale: Option<GradingScale>;
  @Input() isEditable: boolean;

  test$ = new ReplaySubject<Test>(1);
  grading$ = this.test$.pipe(map(this.getGrading.bind(this)));

  constructor(
    private gradeService: DossierGradesService,
    private modalService: BkdModalService,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["test"]) {
      this.test$.next(this.test);
    }
  }

  editGrading(test: Test): void {
    const modalRef = this.modalService.open(DossierGradesEditComponent, {
      backdrop: "static", // prevent closing by click outside of modal
    });
    modalRef.componentInstance.test = test; // TODO
    modalRef.componentInstance.gradeId = this.getGradeId(test);
    modalRef.componentInstance.gradeOptions =
      DossierSingleTestComponent.mapToOptions(this.gradingScale);
    modalRef.componentInstance.studentId = this.studentId;
    modalRef.componentInstance.points = this.getPoints(test);

    modalRef.result.then(
      (updatedTestResult) => {
        if (updatedTestResult) this.updateStudentGrade(updatedTestResult, test);
      },
      () => {},
    );
  }

  private updateStudentGrade(result: Result, test: Test): void {
    const updatedTest = replaceResultInTest(result, test);
    this.gradeService.updateStudentCourses(updatedTest);
  }

  private getGrading(test: Test): string {
    return (
      this.gradingScale?.Grades.find(
        (grade) => grade.Id === this.getGradeId(test),
      )?.Designation || "–"
    );
  }

  private getGradeId(test: Test): Option<number> {
    return resultOfStudent(this.studentId, test)?.GradeId || null;
  }

  // TODO dry up
  private getPoints(test: Test): Option<number> {
    return resultOfStudent(this.studentId, test)?.Points || null;
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
