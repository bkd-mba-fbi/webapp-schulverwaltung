import { DatePipe } from "@angular/common";
import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { TranslatePipe } from "@ngx-translate/core";
import { AddSpacePipe } from "../../../pipes/add-space.pipe";
import { PersonEmailPipe } from "../../../pipes/person-email.pipe";
import { Apprenticeship } from "../../../services/student-profile.service";

@Component({
  selector: "bkd-student-dossier-apprenticeship",
  templateUrl: "./student-dossier-apprenticeship.component.html",
  styleUrls: ["./student-dossier-apprenticeship.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DatePipe, TranslatePipe, AddSpacePipe, PersonEmailPipe],
})
export class StudentDossierApprenticeshipComponent {
  apprenticeship = input.required<Apprenticeship>();

  constructor() {}
}
