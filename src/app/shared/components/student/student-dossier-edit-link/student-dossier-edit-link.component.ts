import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { RouterLink } from "@angular/router";
import { StudentDossierEntry } from "src/app/shared/services/student-dossier.service";

@Component({
  selector: "bkd-student-dossier-edit-link",
  imports: [RouterLink],
  templateUrl: "./student-dossier-edit-link.component.html",
  styleUrl: "./student-dossier-edit-link.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentDossierEditLinkComponent {
  entry = input.required<StudentDossierEntry>();
}
