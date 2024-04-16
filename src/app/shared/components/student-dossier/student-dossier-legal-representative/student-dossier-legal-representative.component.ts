import { NgIf } from "@angular/common";
import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { Person } from "../../../models/person.model";
import { PersonEmailPipe } from "../../../pipes/person-email.pipe";

@Component({
  selector: "erz-student-dossier-legal-representative",
  templateUrl: "./student-dossier-legal-representative.component.html",
  styleUrls: ["./student-dossier-legal-representative.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NgIf, PersonEmailPipe],
})
export class StudentDossierLegalRepresentativeComponent {
  @Input() person: Person;

  constructor() {}
}
