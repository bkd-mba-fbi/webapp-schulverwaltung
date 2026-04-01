import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { Person } from "../../../models/person.model";
import { PersonEmailPipe } from "../../../pipes/person-email.pipe";

@Component({
  selector: "bkd-student-contact-legal-representative",
  templateUrl: "./student-contact-legal-representative.component.html",
  styleUrls: ["./student-contact-legal-representative.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PersonEmailPipe],
})
export class StudentContactLegalRepresentativeComponent {
  @Input() person: Person;

  constructor() {}
}
