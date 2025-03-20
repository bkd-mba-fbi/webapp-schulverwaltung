import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { TranslatePipe } from "@ngx-translate/core";
import { DossierStateService } from "src/app/shared/services/dossier-state.service";
import { SpinnerComponent } from "../../spinner/spinner.component";
import { StudentDossierAddressComponent } from "../student-dossier-address/student-dossier-address.component";
import { StudentDossierApprenticeshipComponent } from "../student-dossier-apprenticeship/student-dossier-apprenticeship.component";
import { StudentDossierLegalRepresentativeComponent } from "../student-dossier-legal-representative/student-dossier-legal-representative.component";

@Component({
  selector: "bkd-dossier-contact",
  templateUrl: "./dossier-contact.component.html",
  styleUrls: ["./dossier-contact.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    StudentDossierAddressComponent,
    StudentDossierLegalRepresentativeComponent,
    StudentDossierApprenticeshipComponent,
    TranslatePipe,
    SpinnerComponent,
  ],
})
export class DossierContactComponent {
  state = inject(DossierStateService);

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
