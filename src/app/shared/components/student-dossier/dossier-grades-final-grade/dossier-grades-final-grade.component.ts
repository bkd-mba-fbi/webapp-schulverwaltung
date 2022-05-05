import { Component, Input } from '@angular/core';
import { FinalGrading, Grading } from 'src/app/shared/models/course.model';
import { GradingScale } from 'src/app/shared/models/grading-scale.model';
import * as Gradings from 'src/app/shared/utils/gradings';
@Component({
  selector: 'erz-dossier-grades-final-grade',
  template: `<div class="row mx-1">
    <div class="col-6">{{ 'dossier.grade' | translate }}</div>
    <div class="col-6">
      <span data-testid="final-grade">{{ getGradeForStudent() || '-' }}</span>
    </div>
    <div class="col-6">{{ 'dossier.average' | translate }}</div>
    <div class="col-6">
      <span data-testid="average-test-results">{{
        grading?.AverageTestResult | number: '1.0-3'
      }}</span>
    </div>
  </div>`,
  styles: [],
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
