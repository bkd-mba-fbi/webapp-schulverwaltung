import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { StudentEntryHeaderComponent } from "../student-entry-header/student-entry-header.component";

@Component({
  selector: "bkd-student-dossier-entry-header",
  imports: [StudentEntryHeaderComponent],
  templateUrl: "./student-dossier-entry-header.component.html",
  styleUrl: "./student-dossier-entry-header.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentDossierEntryHeaderComponent {
  opened = input<boolean>(false);
  headerClick = output<void>();
  icon = input.required<string>();
  category = input<Option<string>>(null);
}
