import { Component, Input } from '@angular/core';
import { Course } from 'src/app/shared/models/course.model';
import { GradingScale } from 'src/app/shared/models/grading-scale.model';
import { Test } from 'src/app/shared/models/test.model';
import { DossierGradesService } from 'src/app/shared/services/dossier-grades.service';

@Component({
  selector: 'erz-dossier-course-tests',
  templateUrl: './dossier-course-tests.component.html',
  styleUrls: ['./dossier-course-tests.component.scss'],
})
export class DossierCourseTestsComponent {
  @Input() studentId: number;
  @Input() course: Course;
  @Input() gradingScales: GradingScale[];
  @Input() isEditable: boolean;

  constructor(public dossierGradeService: DossierGradesService) {}

  getGradingScaleOfTest(test: Test) {
    return this.gradingScales.find(
      (gradingScale) => gradingScale.Id === test.GradingScaleId
    );
  }
}
