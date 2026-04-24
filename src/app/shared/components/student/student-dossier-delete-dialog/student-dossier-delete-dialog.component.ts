import { Component, Input, inject } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { TranslatePipe } from "@ngx-translate/core";

@Component({
  selector: "bkd-student-dossier-delete-dialog",
  templateUrl: "./student-dossier-delete-dialog.component.html",
  styleUrls: ["./student-dossier-delete-dialog.component.scss"],
  imports: [TranslatePipe],
})
export class StudentDossierDeleteDialogComponent {
  activeModal = inject(NgbActiveModal);

  @Input() type: "document" | "note";
}
