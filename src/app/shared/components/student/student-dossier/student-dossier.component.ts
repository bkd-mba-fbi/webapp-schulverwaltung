import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import {
  NgbAccordionBody,
  NgbAccordionCollapse,
  NgbAccordionDirective,
  NgbAccordionItem,
} from "@ng-bootstrap/ng-bootstrap";
import { TranslatePipe } from "@ngx-translate/core";
import {
  StudentDossierEntry,
  StudentDossierService,
} from "src/app/shared/services/student-dossier.service";
import { SpinnerComponent } from "../../spinner/spinner.component";
import { StudentDossierEntryBodyComponent } from "../student-dossier-entry-body/student-dossier-entry-body.component";
import { StudentDossierEntryHeaderComponent } from "../student-dossier-entry-header/student-dossier-entry-header.component";
import { StudentDossierInformationBodyComponent } from "../student-dossier-information-body/student-dossier-information-body.component";

@Component({
  selector: "bkd-student-dossier",
  imports: [
    SpinnerComponent,
    NgbAccordionDirective,
    NgbAccordionItem,
    NgbAccordionCollapse,
    NgbAccordionBody,
    StudentDossierInformationBodyComponent,
    TranslatePipe,
    StudentDossierEntryHeaderComponent,
    StudentDossierEntryBodyComponent,
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
  dossierEntries = toSignal(this.dossierService.filteredDossierEntries$, {
    initialValue: [],
  });

  getEntryIcon(entry: StudentDossierEntry): string {
    if (entry.additionalInformation.File) {
      return "insert_drive_file";
    }
    return "notes";
  }
}
