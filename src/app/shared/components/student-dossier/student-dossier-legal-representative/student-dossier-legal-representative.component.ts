import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { Person } from "../../../models/person.model";

@Component({
  selector: "erz-student-dossier-legal-representative",
  templateUrl: "./student-dossier-legal-representative.component.html",
  styleUrls: ["./student-dossier-legal-representative.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentDossierLegalRepresentativeComponent {
  @Input() person: Person;

  constructor() {}
}
