import { DatePipe } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from "@angular/core";
import { TranslatePipe } from "@ngx-translate/core";
import { Person } from "src/app/shared/models/person.model";
import { AddSpacePipe } from "../../../pipes/add-space.pipe";
import { PersonEmailPipe } from "../../../pipes/person-email.pipe";
import { Apprenticeship } from "../../../services/student-profile.service";

@Component({
  selector: "bkd-student-contact-apprenticeship",
  templateUrl: "./student-contact-apprenticeship.component.html",
  styleUrls: ["./student-contact-apprenticeship.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DatePipe, TranslatePipe, AddSpacePipe, PersonEmailPipe],
})
export class StudentContactApprenticeshipComponent {
  apprenticeship = input.required<Apprenticeship>();
  student = input.required<Person>();

  instructorEmail = computed(() => {
    const value = this.student().Custom1;
    return typeof value === "string" && value.includes("@") ? value : null;
  });

  constructor() {}
}
