import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { Person } from "../../../models/person.model";
import { Student } from "../../../models/student.model";

@Component({
  selector: "bkd-student-dossier-address",
  templateUrl: "./student-dossier-address.component.html",
  styleUrls: ["./student-dossier-address.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
})
export class StudentDossierAddressComponent {
  @Input() student: Student | Person;
  @Input() emailProperty: "DisplayEmail" | "Email2" = "DisplayEmail";

  constructor() {}

  get postalCode(): Option<string> {
    return "PostalCode" in this.student
      ? this.student.PostalCode
      : this.student.Zip;
  }

  get email(): Option<string> {
    if (this.emailProperty === "Email2" && "Email2" in this.student) {
      return this.student.Email2 || null;
    }
    return this.student.DisplayEmail;
  }
}
