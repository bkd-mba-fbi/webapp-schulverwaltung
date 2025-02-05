import { DecimalPipe } from "@angular/common";
import { Component, computed, input } from "@angular/core";
import { FinalGrading, Grading } from "src/app/shared/models/course.model";
import { GradingScale } from "src/app/shared/models/grading-scale.model";
import * as Gradings from "src/app/shared/utils/gradings";

@Component({
  selector: "bkd-dossier-grades-course-header",
  templateUrl: "./dossier-grades-course-header.component.html",
  styleUrls: ["./dossier-grades-course-header.component.scss"],
  imports: [DecimalPipe],
})
export class DossierGradesCourseHeaderComponent {
  readonly finalGrade = input<Option<FinalGrading>>(null);
  readonly grading = input<Option<Grading>>(null);
  readonly gradingScale = input<Option<GradingScale>>(null);
  readonly designation = input<string>();
  readonly average = input<number>();

  readonly grade = computed(() =>
    Gradings.evaluate(this.grading(), this.finalGrade(), this.gradingScale()),
  );
}
