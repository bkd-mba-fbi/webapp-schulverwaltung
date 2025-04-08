import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "bkd-evaluation-dialog",
  imports: [],
  templateUrl: "./evaluation-dialog.component.html",
  styleUrl: "./evaluation-dialog.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EvaluationDialogComponent {
  activeModal = inject(NgbActiveModal);

  grades = ["1.0", "2.0", "3.0", "4.0", "5.0", "6.0"];
  selectedGrade = signal<string | null>(null);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirm(): void {
    if (this.selectedGrade()) {
      this.activeModal.close(this.selectedGrade());
    }
  }
}
