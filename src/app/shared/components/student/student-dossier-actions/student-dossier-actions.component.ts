import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { RouterLink } from "@angular/router";
import { StudentDossierFilterComponent } from "../student-dossier-filter/student-dossier-filter.component";

@Component({
  selector: "bkd-student-dossier-actions",
  imports: [RouterLink, StudentDossierFilterComponent],
  templateUrl: "./student-dossier-actions.component.html",
  styleUrl: "./student-dossier-actions.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentDossierActionsComponent {
  readonly = input(false);
}
