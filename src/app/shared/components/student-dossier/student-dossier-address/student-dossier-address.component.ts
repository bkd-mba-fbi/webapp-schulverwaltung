import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from "@angular/core";
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
  student = input.required<Student | Person>();
  emailProperty = input<"DisplayEmail" | "Email2">("DisplayEmail");

  postalCode = computed(() => {
    const student = this.student();
    return "PostalCode" in student ? student.PostalCode : student.Zip;
  });

  email = computed(() => {
    const student = this.student();
    if (this.emailProperty() === "Email2" && "Email2" in student) {
      return student.Email2 || null;
    }
    return student.DisplayEmail;
  });
}
