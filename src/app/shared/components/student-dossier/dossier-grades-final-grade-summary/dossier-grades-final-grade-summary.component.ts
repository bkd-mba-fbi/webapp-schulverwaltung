import { Component, Input } from '@angular/core';
import { Course } from 'src/app/shared/models/course.model';
import { GradingScale } from 'src/app/shared/models/grading-scale.model';

@Component({
  selector: 'erz-dossier-grades-final-grade-summary',
  templateUrl: './dossier-grades-final-grade-summary.component.html',
  styleUrls: ['./dossier-grades-final-grade-summary.component.scss'],
})
export class DossierGradesFinalGradeSummaryComponent {
  @Input() studentId: number;
  @Input() course: Course;
  @Input() gradingScales: GradingScale[];

  constructor() {}
}
