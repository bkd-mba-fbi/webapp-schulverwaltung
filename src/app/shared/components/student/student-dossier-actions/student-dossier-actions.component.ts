import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { RouterLink } from "@angular/router";

@Component({
  selector: "bkd-student-dossier-actions",
  imports: [RouterLink],
  templateUrl: "./student-dossier-actions.component.html",
  styleUrl: "./student-dossier-actions.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentDossierActionsComponent {
  readonly = input(false);
}
