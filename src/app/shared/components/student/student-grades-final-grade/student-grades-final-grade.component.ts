import { Component, Input } from "@angular/core";
import { TranslatePipe } from "@ngx-translate/core";
import { FinalGrading, Grading } from "src/app/shared/models/course.model";
import { GradingScale } from "src/app/shared/models/grading-scale.model";
import * as Gradings from "src/app/shared/utils/gradings";
import { DecimalOrDashPipe } from "../../../pipes/decimal-or-dash.pipe";

@Component({
  selector: "bkd-student-grades-final-grade",
  template: `<div class="final-entry">
    <div>{{ "student.grades.grade" | translate }}</div>
    <div data-testid="final-grade">
      <span>{{ getGradeForStudent() || "–" }}</span>
    </div>
    <div>{{ "student.grades.average" | translate }}</div>
    <div data-testid="average-test-results">
      <span>{{ average | decimalOrDash: "1-3" }}</span>
    </div>
  </div>`,
  styleUrls: ["./student-grades-final-grade.component.scss"],
  imports: [TranslatePipe, DecimalOrDashPipe],
})
export class StudentGradesFinalGradeComponent {
  @Input() finalGrade: Option<FinalGrading>;
  @Input() grading: Option<Grading>;
  @Input() gradingScale: Option<GradingScale>;
  @Input() average: number;

  constructor() {}

  getGradeForStudent() {
    return Gradings.evaluate(this.grading, this.finalGrade, this.gradingScale);
  }
}
