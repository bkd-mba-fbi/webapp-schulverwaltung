import { Component, Input } from '@angular/core';
import { FinalGrading, Grading } from 'src/app/shared/models/course.model';
import { GradingScale } from 'src/app/shared/models/grading-scale.model';
import * as Gradings from 'src/app/shared/utils/gradings';
@Component({
  selector: 'erz-dossier-grades-final-grade',
  template: `<div class="final-entry">
    <div>{{ 'dossier.grade' | translate }}</div>
    <div data-testid="final-grade">
      <span>{{ getGradeForStudent() || '-' }}</span>
    </div>
    <div>{{ 'dossier.average' | translate }}</div>
    <div data-testid="average-test-results">
      <span>{{ grading?.AverageTestResult | number: '1.0-3' }}</span>
    </div>
  </div>`,
  styleUrls: ['./dossier-grades-final-grade.component.scss'],
})
export class DossierGradesFinalGradeComponent {
  @Input() finalGrade: Option<FinalGrading>;
  @Input() grading: Option<Grading>;
  @Input() gradingScale: Option<GradingScale>;

  constructor() {}

  getGradeForStudent() {
    return Gradings.evaluate(this.grading, this.finalGrade, this.gradingScale);
  }
}
