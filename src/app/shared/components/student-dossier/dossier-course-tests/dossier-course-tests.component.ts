import { Component, Input } from '@angular/core';
import {
  Course,
  FinalGrading,
  Grading,
} from 'src/app/shared/models/course.model';

@Component({
  selector: 'erz-dossier-course-entry',
  templateUrl: './dossier-course-tests.component.html',
  styleUrls: ['./dossier-course-tests.component.scss'],
})
export class DossierCourseTestsComponent {
  @Input() studentId: number;
  @Input() course: Course;

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
}
