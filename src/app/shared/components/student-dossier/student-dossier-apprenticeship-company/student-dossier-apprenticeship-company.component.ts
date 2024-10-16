import { DatePipe } from "@angular/common";
import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";
import { AddSpacePipe } from "../../../pipes/add-space.pipe";
import { PersonEmailPipe } from "../../../pipes/person-email.pipe";
import { ApprenticeshipCompany } from "../../../services/student-profile.service";

@Component({
  selector: "bkd-student-dossier-apprenticeship-company",
  templateUrl: "./student-dossier-apprenticeship-company.component.html",
  styleUrls: ["./student-dossier-apprenticeship-company.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [DatePipe, TranslateModule, AddSpacePipe, PersonEmailPipe],
})
export class StudentDossierApprenticeshipCompanyComponent {
  @Input() company: ApprenticeshipCompany;

  constructor() {}
}
