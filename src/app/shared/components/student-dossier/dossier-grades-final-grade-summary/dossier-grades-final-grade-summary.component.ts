import { Component, Input } from '@angular/core';
import { FinalGrading, Grading } from 'src/app/shared/models/course.model';
import { GradingScale } from 'src/app/shared/models/grading-scale.model';
import * as Gradings from 'src/app/shared/utils/gradings';

@Component({
  selector: 'erz-dossier-grades-final-grade-summary',
  templateUrl: './dossier-grades-final-grade-summary.component.html',
  styleUrls: ['./dossier-grades-final-grade-summary.component.scss'],
})
export class DossierGradesFinalGradeSummaryComponent {
  @Input() designation: string;
  @Input() finalGrade: Option<FinalGrading>;
  @Input() grading: Option<Grading>;
  @Input() gradingScale: Option<GradingScale>;

  constructor() {}

  get grade() {
    return this.getGradeForStudent();
  }

  get average() {
    return this.grading?.AverageTestResult;
  }

  private getGradeForStudent() {
    return Gradings.evaluate(this.grading, this.finalGrade, this.gradingScale);
  }
}
