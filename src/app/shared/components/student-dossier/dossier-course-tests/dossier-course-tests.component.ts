import { Component, Input } from '@angular/core';
import { GradingScale } from 'src/app/shared/models/grading-scale.model';
import { Test } from 'src/app/shared/models/test.model';
import { DossierGradesService } from 'src/app/shared/services/dossier-grades.service';
import { gradingScaleOfTest, sortByDate } from '../../../../events/utils/tests';
import { CourseWithGrades } from '../dossier-grades-view/dossier-grades-view.component';

@Component({
  selector: 'erz-dossier-course-tests',
  templateUrl: './dossier-course-tests.component.html',
  styleUrls: ['./dossier-course-tests.component.scss'],
})
export class DossierCourseTestsComponent {
  @Input() studentId: number;
  @Input() decoratedCourse: CourseWithGrades;
  @Input() gradingScales: GradingScale[];
  @Input() isEditable: boolean;

  constructor(public dossierGradeService: DossierGradesService) {}

  sortedTests() {
    if (!this.decoratedCourse.course.Tests) return [];
    return sortByDate(this.decoratedCourse.course.Tests);
  }

  getGradingScaleOfTest(test: Test) {
    return gradingScaleOfTest(test, this.gradingScales);
  }
}
