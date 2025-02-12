import { AsyncPipe } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { TranslatePipe } from "@ngx-translate/core";
import { DossierStateService } from "src/app/shared/services/dossier-state.service";
import { StudentDossierAddressComponent } from "../student-dossier-address/student-dossier-address.component";
import { StudentDossierApprenticeshipCompanyComponent } from "../student-dossier-apprenticeship-company/student-dossier-apprenticeship-company.component";
import { StudentDossierLegalRepresentativeComponent } from "../student-dossier-legal-representative/student-dossier-legal-representative.component";

@Component({
  selector: "bkd-dossier-contact",
  templateUrl: "./dossier-contact.component.html",
  styleUrls: ["./dossier-contact.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    StudentDossierAddressComponent,
    StudentDossierLegalRepresentativeComponent,
    StudentDossierApprenticeshipCompanyComponent,
    AsyncPipe,
    TranslatePipe,
  ],
})
export class DossierContactComponent {
  state = inject(DossierStateService);

  constructor() {
    this.state.dossierPage$.next("contact");
  }
}
