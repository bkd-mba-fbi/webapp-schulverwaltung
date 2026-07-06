import { DecimalPipe } from "@angular/common";
import { Component, computed, input } from "@angular/core";
import { FinalGrading, Grading } from "src/app/shared/models/course.model";
import { GradingScale } from "src/app/shared/models/grading-scale.model";
import { evaluate } from "src/app/shared/utils/gradings";

@Component({
  selector: "bkd-student-grades-course-header",
  templateUrl: "./student-grades-course-header.component.html",
  styleUrls: ["./student-grades-course-header.component.scss"],
  imports: [DecimalPipe],
})
export class StudentGradesCourseHeaderComponent {
  readonly designation = input.required<string>();
  readonly finalGrade = input<Option<FinalGrading>>(null);
  readonly grading = input<Option<Grading>>(null);
  readonly gradingScale = input<Option<GradingScale>>(null);
  readonly average = input<number>(0);

  readonly gradeForStudent = computed(() =>
    evaluate(this.grading(), this.finalGrade(), this.gradingScale()),
  );

  constructor() {}
}
