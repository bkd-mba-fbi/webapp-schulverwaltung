import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { map, ReplaySubject, tap } from 'rxjs';
import {
  replaceResultInTest,
  resultOfStudent,
} from 'src/app/events/utils/tests';
import {
  TestGradesResult,
  UpdatedTestResultResponse,
} from 'src/app/shared/models/course.model';
import { DropDownItem } from 'src/app/shared/models/drop-down-item.model';
import { GradingScale } from 'src/app/shared/models/grading-scale.model';
import { Test } from 'src/app/shared/models/test.model';
import { CoursesRestService } from 'src/app/shared/services/courses-rest.service';
import { DossierGradesEditComponent } from '../dossier-grades-edit/dossier-grades-edit.component';

@Component({
  selector: 'erz-dossier-single-test',
  template: ` <div class="test-entry" *erzLet="test$ | async as test">
    <div class="designation" data-testid="test-designation">
      {{ test.Designation }}
    </div>
    <div class="date" data-testid="test-date">
      {{ test.Date | date: 'mediumDate' }}
    </div>
    <div class="grade">
      <a
        class="btn btn-link"
        aria-label="edit grade"
        (click)="editGrading(test)"
      >
        <i class="material-icons">edit</i>
        <span data-testid="test-grade">{{ grading$ | async }}</span>
      </a>
    </div>
    <div class="factor" data-testid="test-factor">
      {{ test | erzTestWeight }}
    </div>
    <div class="points" data-testid="test-points">
      <span>{{ test | erzTestPoints: studentId }}</span>
    </div>
    <div class="teacher" data-testid="test-teacher">
      {{ test.Owner }}
    </div>
    <div class="state" data-testid="test-status">
      {{
        (test.IsPublished ? 'tests.published' : 'tests.not-published')
          | translate
      }}
    </div>
  </div>`,
  styleUrls: ['./dossier-single-test.component.scss'],
})
export class DossierSingleTestComponent implements OnInit {
  @Input() test: Test;
  @Input() studentId: number;
  @Input() gradingScale: Option<GradingScale>;

  test$ = new ReplaySubject<Test>(1);
  grading$ = this.test$.pipe(map(this.getGrading.bind(this)));

  constructor(
    private modalService: NgbModal,
    private courseService: CoursesRestService
  ) {}

  ngOnInit(): void {
    debugger;
    this.test$.next(this.test);
  }

  editGrading(test: Test): void {
    const modalRef = this.modalService.open(DossierGradesEditComponent);
    modalRef.componentInstance.designation = test.Designation;
    modalRef.componentInstance.gradeId = this.getGradeId(test);
    modalRef.componentInstance.gradeOptions = this.mapToOptions(
      this.gradingScale
    );
    modalRef.result.then(
      (selectedGrade) => {
        const result: TestGradesResult = {
          StudentIds: [this.studentId],
          TestId: test.Id,
          GradeId: selectedGrade,
        };
        this.courseService
          .updateTestResult(test.CourseId, result)
          .subscribe((response) => this.updateStudentGrade(response, test));
      },
      () => {}
    );
  }

  private updateStudentGrade(
    newGrades: UpdatedTestResultResponse,
    test: Test
  ): void {
    const updatedTest = replaceResultInTest(newGrades.TestResults[0], test);
    this.test$.next(updatedTest);
  }

  private getGrading(test: Test): string {
    return (
      this.gradingScale?.Grades.find(
        (grade) => grade.Id === this.getGradeId(test)
      )?.Designation || '-'
    );
  }

  private getGradeId(test: Test): Option<number> {
    return resultOfStudent(this.studentId, test)?.GradeId || null;
  }

  private mapToOptions(
    gradingScale: Option<GradingScale>
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
