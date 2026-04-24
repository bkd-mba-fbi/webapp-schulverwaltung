import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { NgbAccordionDirective } from "@ng-bootstrap/ng-bootstrap";
import { TranslatePipe } from "@ngx-translate/core";
import { StudentDossierService } from "src/app/shared/services/student-dossier.service";
import { SpinnerComponent } from "../../spinner/spinner.component";
import { StudentDossierEntryComponent } from "../student-dossier-entry/student-dossier-entry.component";
import { StudentDossierInformationComponent } from "../student-dossier-information/student-dossier-information.component";

@Component({
  selector: "bkd-student-dossier",
  imports: [
    SpinnerComponent,
    NgbAccordionDirective,
    StudentDossierInformationComponent,
    StudentDossierEntryComponent,
    TranslatePipe,
  ],
  templateUrl: "./student-dossier.component.html",
  styleUrl: "./student-dossier.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [StudentDossierService],
})
export class StudentDossierComponent {
  dossierService = inject(StudentDossierService);

  loading = toSignal(this.dossierService.loading$, { requireSync: true });
  informationEntries = toSignal(this.dossierService.informationEntries$, {
    initialValue: [],
  });
  disadvantageEntries = toSignal(this.dossierService.disadvantageEntries$, {
    initialValue: [],
  });
  dossierEntries = toSignal(this.dossierService.dossierEntries$, {
    initialValue: [],
  });
}
