import { AsyncPipe } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import {
  NgbAccordionBody,
  NgbAccordionCollapse,
  NgbAccordionDirective,
  NgbAccordionHeader,
  NgbAccordionItem,
  NgbCollapse,
} from "@ng-bootstrap/ng-bootstrap";
import { TranslatePipe } from "@ngx-translate/core";
import { DossierStateService } from "src/app/shared/services/dossier-state.service";
import { StudentDossierAddressComponent } from "../student-dossier-address/student-dossier-address.component";
import { StudentDossierApprenticeshipCompanyComponent } from "../student-dossier-apprenticeship-company/student-dossier-apprenticeship-company.component";
import { StudentDossierEntryHeaderComponent } from "../student-dossier-entry-header/student-dossier-entry-header.component";
import { StudentDossierLegalRepresentativeComponent } from "../student-dossier-legal-representative/student-dossier-legal-representative.component";

@Component({
  selector: "bkd-dossier-addresses",
  templateUrl: "./dossier-addresses.component.html",
  styleUrls: ["./dossier-addresses.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    StudentDossierAddressComponent,
    NgbAccordionDirective,
    NgbAccordionItem,
    NgbAccordionHeader,
    StudentDossierEntryHeaderComponent,
    NgbCollapse,
    NgbAccordionCollapse,
    NgbAccordionBody,
    StudentDossierLegalRepresentativeComponent,
    StudentDossierApprenticeshipCompanyComponent,
    AsyncPipe,
    TranslatePipe,
  ],
})
export class DossierAddressesComponent {
  state = inject(DossierStateService);

  constructor() {
    this.state.currentDossier$.next("addresses");
  }
}
