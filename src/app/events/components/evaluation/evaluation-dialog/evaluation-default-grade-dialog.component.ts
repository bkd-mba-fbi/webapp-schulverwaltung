import {
  ChangeDetectionStrategy,
  Component,
  Input,
  computed,
  inject,
  input,
  signal,
} from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { TranslatePipe } from "@ngx-translate/core";
import { SelectComponent } from "../../../../shared/components/select/select.component";
import { GradingItem } from "../../../../shared/models/grading-item.model";
import { GradingScale } from "../../../../shared/models/grading-scale.model";
import { GradingItemsRestService } from "../../../../shared/services/grading-items-rest.service";

@Component({
  selector: "bkd-evaluation-dialog",
  imports: [SelectComponent, TranslatePipe],
  templateUrl: "./evaluation-default-grade-dialog.component.html",
  styleUrl: "./evaluation-default-grade-dialog.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EvaluationDefaultGradeDialogComponent {
  activeModal = inject(NgbActiveModal);
  gradingItemsRestService = inject(GradingItemsRestService);

  @Input() eventId: number;
  gradingScale = input.required<GradingScale>();
  gradingItems = input.required<ReadonlyArray<GradingItem>>();
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

  updateGrades(): void {
    const selectedGrade = this.selectedGrade();
    const eventId = this.eventId;

    if (selectedGrade && eventId) {
      const existingGradingItems = this.gradingItems();
      const updatedGradingItems = existingGradingItems.map((item) => ({
        ...item,
        IdGrade: selectedGrade.Id,
      }));

      this.gradingItemsRestService
        .updateGradesForStudents(eventId, updatedGradingItems)
        .subscribe({
          next: () => this.activeModal.close(),
          error: (err) => console.error("Error updating grades", err),
        });
    }
  }

  cancel(): void {
    this.activeModal.dismiss();
  }
}
