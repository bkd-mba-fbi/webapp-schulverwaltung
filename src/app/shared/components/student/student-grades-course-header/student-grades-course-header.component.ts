import { DecimalPipe } from "@angular/common";
import { Component, Input } from "@angular/core";
import { FinalGrading, Grading } from "src/app/shared/models/course.model";
import { GradingScale } from "src/app/shared/models/grading-scale.model";
import * as Gradings from "src/app/shared/utils/gradings";

@Component({
  selector: "bkd-student-grades-course-header",
  templateUrl: "./student-grades-course-header.component.html",
  styleUrls: ["./student-grades-course-header.component.scss"],
  imports: [DecimalPipe],
})
export class StudentGradesCourseHeaderComponent {
  @Input() designation: string;
  @Input() finalGrade: Option<FinalGrading>;
  @Input() grading: Option<Grading>;
  @Input() gradingScale: Option<GradingScale>;
  @Input() average: number;

  constructor() {}

  get grade() {
    return this.getGradeForStudent();
  }

  private getGradeForStudent() {
    return Gradings.evaluate(this.grading, this.finalGrade, this.gradingScale);
  }
}
