import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { TranslatePipe } from "@ngx-translate/core";

@Component({
  selector: "bkd-evaluation-finalise-dialog",
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: "./evaluation-finalise-dialog.component.html",
  styleUrl: "./evaluation-finalise-dialog.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EvaluationFinaliseDialogComponent {
  activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirm(): void {
    this.activeModal.close();
  }
}
