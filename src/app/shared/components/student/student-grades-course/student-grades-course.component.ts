import { Component, computed, input } from "@angular/core";
import { TranslatePipe } from "@ngx-translate/core";
import { GradingScale } from "src/app/shared/models/grading-scale.model";
import { Test } from "src/app/shared/models/test.model";
import { gradingScaleOfTest, sortByDate } from "../../../../events/utils/tests";
import { CourseWithGrades } from "../student-grades-accordion/student-grades-accordion.component";
import { StudentGradesFinalGradeComponent } from "../student-grades-final-grade/student-grades-final-grade.component";
import { StudentGradesTestComponent } from "../student-grades-test/student-grades-test.component";

@Component({
  selector: "bkd-student-grades-course",
  templateUrl: "./student-grades-course.component.html",
  styleUrls: ["./student-grades-course.component.scss"],
  imports: [
    StudentGradesFinalGradeComponent,
    StudentGradesTestComponent,
    TranslatePipe,
  ],
})
export class StudentGradesCourseComponent {
  studentId = input.required<number>();
  decoratedCourse = input.required<CourseWithGrades>();
  gradingScales = input.required<ReadonlyArray<GradingScale>>();
  isEditable = input.required<boolean>();

  sortedTests = computed(() =>
    sortByDate(this.decoratedCourse().course.Tests ?? []),
  );
  canEditGrades = computed(
    () =>
      this.isEditable() &&
      (this.decoratedCourse().course.FinalGrades ?? []).length === 0,
  );

  getGradingScaleOfTest(test: Test) {
    return gradingScaleOfTest(test, this.gradingScales());
  }
}
