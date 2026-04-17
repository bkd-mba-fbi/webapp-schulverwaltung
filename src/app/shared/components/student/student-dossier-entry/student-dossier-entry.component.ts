import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from "@angular/core";
import {
  NgbAccordionBody,
  NgbAccordionCollapse,
  NgbAccordionHeader,
  NgbAccordionItem,
  NgbCollapse,
} from "@ng-bootstrap/ng-bootstrap";
import { StudentDossierEntry } from "src/app/shared/services/student-dossier.service";
import { StudentDossierEntryBodyComponent } from "../student-dossier-entry-body/student-dossier-entry-body.component";
import { StudentDossierEntryHeaderComponent } from "../student-dossier-entry-header/student-dossier-entry-header.component";

@Component({
  selector: "bkd-student-dossier-entry",
  imports: [
    NgbAccordionItem,
    NgbAccordionHeader,
    NgbCollapse,
    NgbAccordionCollapse,
    NgbAccordionBody,
    StudentDossierEntryHeaderComponent,
    StudentDossierEntryBodyComponent,
  ],
  templateUrl: "./student-dossier-entry.component.html",
  styleUrl: "./student-dossier-entry.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentDossierEntryComponent {
  entry = input.required<StudentDossierEntry>();

  entryIcon = computed(() => {
    if (this.entry().additionalInformation.File) {
      return "insert_drive_file";
    }
    return "notes";
  });
}
