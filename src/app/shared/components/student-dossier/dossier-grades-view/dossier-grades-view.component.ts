import { Component, Input } from '@angular/core';
import {
  Course,
  FinalGrading,
  Grading,
} from 'src/app/shared/models/course.model';
import { GradingScale } from 'src/app/shared/models/grading-scale.model';
import { DossierGradesService } from 'src/app/shared/services/dossier-grades.service';
import { Subject } from 'rxjs';
import { average } from '../../../utils/math';

export interface CourseWithGrades {
  course: Course;
  finalGrade?: FinalGrading;
  grading?: Grading;
  gradingScale?: GradingScale;
  average: number;
}

@Component({
  selector: 'erz-dossier-grades-view',
  templateUrl: './dossier-grades-view.component.html',
  styleUrls: ['./dossier-grades-view.component.scss'],
})
export class DossierGradesViewComponent {
  @Input() courses: Course[];
  @Input() studentId: number;
  @Input() gradingScales: GradingScale[];
  @Input() isEditable: boolean = true;

  constructor(public dossierGradeService: DossierGradesService) {}

  decoratedCoursesSubject$: Subject<CourseWithGrades[]> = new Subject<
    CourseWithGrades[]
  >();

  ngOnChanges() {
    this.decoratedCoursesSubject$.next(this.decorateCourses());
  }

  private decorateCourses(): CourseWithGrades[] {
    return this.courses?.map((course) => {
      const finalGrade = this.dossierGradeService.getFinalGradeForStudent(
        course,
        this.studentId
      );
      const grades = this.dossierGradeService.getGradesForStudent(
        course,
        this.studentId,
        this.gradingScales
      );

      return {
        course,
        finalGrade,
        grading: this.dossierGradeService.getGradingForStudent(
          course,
          this.studentId
        ),
        gradingScale: this.dossierGradeService.getGradingScaleOfCourse(
          course,
          this.gradingScales
        ),
        average: finalGrade?.AverageTestResult || average(grades),
      };
    });
  }
}
