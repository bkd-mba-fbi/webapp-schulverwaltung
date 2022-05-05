import { Component, Input } from '@angular/core';
import {
  Course,
  FinalGrading,
  Grading,
} from 'src/app/shared/models/course.model';
import { GradingScale } from 'src/app/shared/models/grading-scale.model';

@Component({
  selector: 'erz-dossier-course-tests',
  templateUrl: './dossier-course-tests.component.html',
  styleUrls: ['./dossier-course-tests.component.scss'],
})
export class DossierCourseTestsComponent {
  @Input() studentId: number;
  @Input() course: Course;
  @Input() gradingScales: GradingScale[];

  constructor() {}

  public getFinalGradeForStudent(): FinalGrading | undefined {
    return this.course?.FinalGrades?.find(
      (finaleGrade) => finaleGrade.StudentId === this.studentId
    );
  }

  public getGradingForStudent(): Grading | undefined {
    return this.course?.Gradings?.find(
      (grade) => grade.StudentId === this.studentId
    );
  }

  public getGradingScaleOfCourse() {
    return this.gradingScales?.find(
      (gradingScale) => gradingScale.Id === this.course.GradingScaleId
    );
  }
}
