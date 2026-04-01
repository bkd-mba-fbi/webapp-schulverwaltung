import { DatePipe } from "@angular/common";
import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { TranslatePipe } from "@ngx-translate/core";
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

  constructor() {}
}
