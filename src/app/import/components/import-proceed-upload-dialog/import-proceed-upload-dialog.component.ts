import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { TranslatePipe } from "@ngx-translate/core";

@Component({
  selector: "bkd-import-proceed-upload-dialog",
  imports: [TranslatePipe],
  templateUrl: "./import-proceed-upload-dialog.component.html",
  styleUrl: "./import-proceed-upload-dialog.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImportProceedUploadDialogComponent {
  activeModal = inject(NgbActiveModal);

  validCount = input.required<number>();
  invalidCount = input.required<number>();
}
