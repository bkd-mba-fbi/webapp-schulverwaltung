import { Component, computed, input } from "@angular/core";
import { TranslatePipe } from "@ngx-translate/core";
import { FinalGrading, Grading } from "src/app/shared/models/course.model";
import { GradingScale } from "src/app/shared/models/grading-scale.model";
import * as Gradings from "src/app/shared/utils/gradings";
import { DecimalOrDashPipe } from "../../../pipes/decimal-or-dash.pipe";

@Component({
  selector: "bkd-dossier-grades-final-grade",
  template: `<div class="final-entry">
    <div>{{ "dossier.grade" | translate }}</div>
    <div data-testid="final-grade">
      <span>{{ grade() || "–" }}</span>
    </div>
    <div>{{ "dossier.average" | translate }}</div>
    <div data-testid="average-test-results">
      <span>{{ average() | decimalOrDash: "1-3" }}</span>
    </div>
  </div>`,
  styleUrls: ["./dossier-grades-final-grade.component.scss"],
  imports: [TranslatePipe, DecimalOrDashPipe],
})
export class DossierGradesFinalGradeComponent {
  readonly finalGrade = input<Option<FinalGrading>>(null);
  readonly grading = input<Option<Grading>>(null);
  readonly gradingScale = input<Option<GradingScale>>(null);
  readonly average = input<number>();

  grade = computed(() =>
    Gradings.evaluate(this.grading(), this.finalGrade(), this.gradingScale()),
  );
}
