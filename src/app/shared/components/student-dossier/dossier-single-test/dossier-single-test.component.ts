import { Component, Input } from '@angular/core';
import { resultOfStudent } from 'src/app/events/utils/tests';
import { GradingScale } from 'src/app/shared/models/grading-scale.model';
import { Test } from 'src/app/shared/models/test.model';

@Component({
  selector: 'erz-dossier-single-test',
  template: ` <div class="test-entry">
    <div class="designation" data-testid="test-designation">
      {{ test?.Designation }}
    </div>
    <div class="date" data-testid="test-date">
      {{ test?.Date | date: 'mediumDate' }}
    </div>
    <div class="grade">
      <a
        class="btn btn-link"
        aria-label="edit grade"
        (click)="editGrading(test)"
      >
        <i class="material-icons">edit</i>
        <span data-testid="test-grade">{{ getGrading() || '-' }}</span>
      </a>
    </div>
    <div class="factor" data-testid="test-factor">
      {{ test | erzTestWeight }}
    </div>
    <div class="points" data-testid="test-points">
      <span>{{ test | erzTestPoints: studentId }}</span>
    </div>
    <div class="teacher" data-testid="test-teacher">
      {{ test?.Owner }}
    </div>
    <div class="state" data-testid="test-status">
      {{
        (test?.IsPublished ? 'tests.published' : 'tests.not-published')
          | translate
      }}
    </div>
  </div>`,
  styleUrls: ['./dossier-single-test.component.scss'],
})
export class DossierSingleTestComponent {
  @Input() test: Option<Test>;
  @Input() studentId: number;
  @Input() gradingScale: Option<GradingScale>;

  constructor() {}

  getGrading() {
    if (!this.test) return '-';
    return this.gradingScale?.Grades.find(
      (grade) =>
        grade.Id === resultOfStudent(this.studentId, this.test!)?.GradeId
    )?.Value;
  }

  editGrading(test: Option<Test>): void {
    console.log('test', test);
  }
}
