import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { SelectComponent } from "../../../../shared/components/select/select.component";

@Component({
  selector: "bkd-evaluation-dialog",
  imports: [SelectComponent],
  templateUrl: "./evaluation-dialog.component.html",
  styleUrl: "./evaluation-dialog.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EvaluationDialogComponent {
  activeModal = inject(NgbActiveModal);

  grades = [
    { Key: 1, Value: "1.1" },
    { Key: 2, Value: "4.5" },
    { Key: 3, Value: "7.0" },
    { Key: 4, Value: "8.5" },
    { Key: 5, Value: "3.0" },
  ];

  selectedGradeKey = signal<number | null>(null);

  options = this.grades;

  selectedGrade = computed(() => {
    const key = this.selectedGradeKey();
    return this.options.find((o) => o.Key === key) ?? null;
  });

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirm(): void {
    if (this.selectedGrade()) {
      this.activeModal.close(this.selectedGrade());
    }
  }

  setGradeByKey(key: number | null) {
    this.selectedGradeKey.set(key);
  }
}
