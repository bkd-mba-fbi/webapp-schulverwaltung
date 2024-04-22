import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { CaretComponent } from "../../caret/caret.component";

@Component({
  selector: "bkd-student-dossier-entry-header",
  templateUrl: "./student-dossier-entry-header.component.html",
  styleUrls: ["./student-dossier-entry-header.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CaretComponent],
})
export class StudentDossierEntryHeaderComponent {
  @Input() opened = false;

  constructor() {}
}
