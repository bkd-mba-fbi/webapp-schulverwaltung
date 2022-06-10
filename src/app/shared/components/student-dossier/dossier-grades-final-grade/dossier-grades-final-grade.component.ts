import { Component, Input } from '@angular/core';
import { FinalGrading, Grading } from 'src/app/shared/models/course.model';
import { GradingScale } from 'src/app/shared/models/grading-scale.model';
import * as Gradings from 'src/app/shared/utils/gradings';
import { DecimalPipe } from '@angular/common';
@Component({
  selector: 'erz-dossier-grades-final-grade',
  template: `<div class="final-entry">
    <div>{{ 'dossier.grade' | translate }}</div>
    <div data-testid="final-grade">
      <span>{{ getGradeForStudent() || '-' }}</span>
    </div>
    <div>{{ 'dossier.average' | translate }}</div>
    <div data-testid="average-test-results">
      <span>{{ average }}</span>
    </div>
  </div>`,
  styleUrls: ['./dossier-grades-final-grade.component.scss'],
  providers: [DecimalPipe],
})
export class DossierGradesFinalGradeComponent {
  @Input() finalGrade: Option<FinalGrading>;
  @Input() grading: Option<Grading>;
  @Input() gradingScale: Option<GradingScale>;

  constructor(private decimalPipe: DecimalPipe) {}

  getGradeForStudent() {
    return Gradings.evaluate(this.grading, this.finalGrade, this.gradingScale);
  }

  get average(): string | number {
    if (!this.grading) return '-';
    if (this.grading?.AverageTestResult === 0) return '-';
    return (
      this.decimalPipe.transform(this.grading.AverageTestResult, '1.0-3') ?? '-'
    );
  }
}
