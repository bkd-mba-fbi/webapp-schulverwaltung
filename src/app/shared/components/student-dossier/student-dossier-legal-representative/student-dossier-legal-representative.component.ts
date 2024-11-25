import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { Person } from "../../../models/person.model";
import { PersonEmailPipe } from "../../../pipes/person-email.pipe";

@Component({
  selector: "bkd-student-dossier-legal-representative",
  templateUrl: "./student-dossier-legal-representative.component.html",
  styleUrls: ["./student-dossier-legal-representative.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PersonEmailPipe],
})
export class StudentDossierLegalRepresentativeComponent {
  @Input() person: Person;

  constructor() {}
}
