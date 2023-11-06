import { Component, Input, OnChanges } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import {
  Course,
  FinalGrading,
  Grading,
} from "src/app/shared/models/course.model";
import { GradingScale } from "src/app/shared/models/grading-scale.model";
import { DossierGradesService } from "src/app/shared/services/dossier-grades.service";
import { weightedAverage } from "../../../utils/math";

export interface CourseWithGrades {
  course: Course;
  finalGrade?: FinalGrading;
  grading?: Grading;
  gradingScale?: GradingScale;
  average: number;
}

@Component({
  selector: "erz-dossier-grades-view",
  templateUrl: "./dossier-grades-view.component.html",
  styleUrls: ["./dossier-grades-view.component.scss"],
})
export class DossierGradesViewComponent implements OnChanges {
  @Input() courses: Course[];
  @Input() studentId: number;
  @Input() gradingScales: GradingScale[];
  @Input() isEditable: boolean = true;

  constructor(public dossierGradeService: DossierGradesService) {}

  decoratedCoursesSubject$ = new BehaviorSubject<CourseWithGrades[]>([]);

  ngOnChanges() {
    this.decoratedCoursesSubject$.next(this.decorateCourses());
  }

  trackByCourseId(_index: number, item: CourseWithGrades): number {
    return item.course.Id;
  }

  private decorateCourses(): CourseWithGrades[] {
    return this.courses?.map((course) => {
      const finalGrade = this.dossierGradeService.getFinalGradeForStudent(
        course,
        this.studentId,
      );
      const grades = this.dossierGradeService.getGradesForStudent(
        course,
        this.studentId,
        this.gradingScales,
      );

      return {
        course,
        finalGrade,
        grading: this.dossierGradeService.getGradingForStudent(
          course,
          this.studentId,
        ),
        gradingScale: this.dossierGradeService.getGradingScaleOfCourse(
          course,
          this.gradingScales,
        ),
        average: finalGrade?.AverageTestResult || weightedAverage(grades),
      };
    });
  }
}
