import { Component, Input } from '@angular/core';
import { resultOfStudent } from 'src/app/events/utils/tests';
import { GradingScale } from 'src/app/shared/models/grading-scale.model';
import { Test } from 'src/app/shared/models/test.model';

@Component({
  selector: 'erz-dossier-single-test',
  template: ` <div>
    <span data-testid="test-designation">{{ test?.Designation }}</span>
    <div class="row">
      <div class="col-6" data-testid="test-date">
        {{ test?.Date | date: 'mediumDate' }}
      </div>
      <div class="col-6" data-testid="test-grade">
        {{ getGrading() || '-' }}
      </div>
      <div class="col-6" data-testid="test-factor">
        {{ test | erzTestWeight }}
      </div>
      <div class="col-6 points" data-testid="test-points">
        {{ test | erzTestPoints: studentId }}
      </div>
      <div class="col-6" data-testid="test-teacher">
        {{ test?.Owner }}
      </div>
      <div class="col-6"></div>
      <div class="col-6" data-testid="test-status">
        {{
          (test?.IsPublished ? 'tests.published' : 'tests.not-published')
            | translate
        }}
      </div>
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
}