import { DatePipe } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { RouterLink } from "@angular/router";
import {
  NgbAccordionBody,
  NgbAccordionCollapse,
  NgbAccordionDirective,
  NgbAccordionHeader,
  NgbAccordionItem,
  NgbCollapse,
} from "@ng-bootstrap/ng-bootstrap";
import { TranslatePipe } from "@ngx-translate/core";
import { SpinnerComponent } from "../../../shared/components/spinner/spinner.component";
import { StudentDossierAddressComponent } from "../../../shared/components/student-dossier/student-dossier-address/student-dossier-address.component";
import { StudentDossierApprenticeshipComponent } from "../../../shared/components/student-dossier/student-dossier-apprenticeship/student-dossier-apprenticeship.component";
import { StudentDossierEntryHeaderComponent } from "../../../shared/components/student-dossier/student-dossier-entry-header/student-dossier-entry-header.component";
import { StudentDossierLegalRepresentativeComponent } from "../../../shared/components/student-dossier/student-dossier-legal-representative/student-dossier-legal-representative.component";
import { MyProfileService } from "../../services/my-profile.service";
import { MyProfileAddressComponent } from "../my-profile-address/my-profile-address.component";
import { MyProfileEntryComponent } from "../my-profile-entry/my-profile-entry.component";
import { MyProfileHeaderComponent } from "../my-profile-header/my-profile-header.component";

@Component({
  selector: "bkd-my-profile-show",
  templateUrl: "./my-profile-show.component.html",
  styleUrls: ["./my-profile-show.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MyProfileHeaderComponent,
    MyProfileEntryComponent,
    NgbAccordionDirective,
    NgbAccordionItem,
    NgbAccordionHeader,
    StudentDossierEntryHeaderComponent,
    NgbCollapse,
    NgbAccordionCollapse,
    NgbAccordionBody,
    RouterLink,
    StudentDossierAddressComponent,
    MyProfileAddressComponent,
    StudentDossierLegalRepresentativeComponent,
    StudentDossierApprenticeshipComponent,
    SpinnerComponent,
    DatePipe,
    TranslatePipe,
  ],
})
export class MyProfileShowComponent {
  profileService = inject(MyProfileService);

  person = toSignal(this.profileService.person$, { initialValue: null });
  loadingPerson = toSignal(this.profileService.loadingPerson$, {
    requireSync: true,
  });

  legalRepresentatives = toSignal(this.profileService.legalRepresentatives$, {
    initialValue: null,
  });
  loadingLegalRepresentatives = toSignal(
    this.profileService.loadingLegalRepresentatives$,
    { requireSync: true },
  );

  apprenticeships = toSignal(this.profileService.apprenticeships$);
  loadingApprenticeships = toSignal(
    this.profileService.loadingApprenticeships$,
    {
      requireSync: true,
    },
  );

  stayPermit = toSignal(this.profileService.stayPermit$, {
    initialValue: null,
  });
  loadingStayPermit = toSignal(this.profileService.loadingStayPermit$, {
    requireSync: true,
  });
}
