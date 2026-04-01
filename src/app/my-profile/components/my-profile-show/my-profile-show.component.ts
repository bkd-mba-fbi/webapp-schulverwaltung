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
import { StudentContactAddressComponent } from "../../../shared/components/student/student-contact-address/student-contact-address.component";
import { StudentContactApprenticeshipComponent } from "../../../shared/components/student/student-contact-apprenticeship/student-contact-apprenticeship.component";
import { StudentContactLegalRepresentativeComponent } from "../../../shared/components/student/student-contact-legal-representative/student-contact-legal-representative.component";
import { StudentEntryHeaderComponent } from "../../../shared/components/student/student-entry-header/student-entry-header.component";
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
    StudentEntryHeaderComponent,
    NgbCollapse,
    NgbAccordionCollapse,
    NgbAccordionBody,
    RouterLink,
    StudentContactAddressComponent,
    MyProfileAddressComponent,
    StudentContactLegalRepresentativeComponent,
    StudentContactApprenticeshipComponent,
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
