import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  signal,
} from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { TranslatePipe } from "@ngx-translate/core";
import { SelectComponent } from "../../../../shared/components/select/select.component";
import { GradingScale } from "../../../../shared/models/grading-scale.model";

@Component({
  selector: "bkd-evaluation-dialog",
  imports: [SelectComponent, TranslatePipe],
  templateUrl: "./evaluation-default-grade-dialog.component.html",
  styleUrl: "./evaluation-default-grade-dialog.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EvaluationDefaultGradeDialogComponent {
  activeModal = inject(NgbActiveModal);

  gradingScale = input.required<GradingScale>();
  selectedGradeKey = signal<number | null>(null);

  options = computed(() =>
    this.gradingScale().Grades.map((grade) => ({
      Key: grade.Id,
      Value: grade.Designation,
    })),
  );

  selectedGrade = computed(() => {
    const key = this.selectedGradeKey();
    return this.gradingScale().Grades.find((grade) => grade.Id === key) ?? null;
  });

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirm(): void {
    if (this.selectedGrade()) {
      this.activeModal.close(this.selectedGrade());
    }
  }
}
