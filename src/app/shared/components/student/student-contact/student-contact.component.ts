import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { TranslatePipe } from "@ngx-translate/core";
import { StudentStateService } from "src/app/shared/services/student-state.service";
import { SpinnerComponent } from "../../spinner/spinner.component";
import { StudentContactAddressComponent } from "../student-contact-address/student-contact-address.component";
import { StudentContactApprenticeshipComponent } from "../student-contact-apprenticeship/student-contact-apprenticeship.component";
import { StudentContactLegalRepresentativeComponent } from "../student-contact-legal-representative/student-contact-legal-representative.component";

@Component({
  selector: "bkd-student-contact",
  templateUrl: "./student-contact.component.html",
  styleUrls: ["./student-contact.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    StudentContactAddressComponent,
    StudentContactLegalRepresentativeComponent,
    StudentContactApprenticeshipComponent,
    TranslatePipe,
    SpinnerComponent,
  ],
})
export class StudentContactComponent {
  state = inject(StudentStateService);

  student = toSignal(this.state.student$);
  loadingStudent = toSignal(this.state.loadingStudent$, { requireSync: true });

  legalRepresentatives = toSignal(this.state.legalRepresentatives$, {
    initialValue: null,
  });
  loadingLegalRepresentatives = toSignal(
    this.state.loadingLegalRepresentatives$,
    { requireSync: true },
  );

  apprenticeships = toSignal(this.state.apprenticeships$);
  loadingApprenticeships = toSignal(this.state.loadingApprenticeships$, {
    requireSync: true,
  });
}
