import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import {
  NgbAccordionBody,
  NgbAccordionCollapse,
  NgbAccordionHeader,
  NgbAccordionItem,
  NgbCollapse,
} from "@ng-bootstrap/ng-bootstrap";
import { TranslatePipe } from "@ngx-translate/core";
import { StudentDossierEntry } from "src/app/shared/services/student-dossier.service";
import { StudentDossierEntryDescriptionComponent } from "../student-dossier-entry-description/student-dossier-entry-description.component";
import { StudentDossierEntryHeaderComponent } from "../student-dossier-entry-header/student-dossier-entry-header.component";

@Component({
  selector: "bkd-student-dossier-information",
  imports: [
    NgbAccordionItem,
    NgbAccordionHeader,
    NgbCollapse,
    NgbAccordionCollapse,
    NgbAccordionBody,
    TranslatePipe,
    StudentDossierEntryHeaderComponent,
    StudentDossierEntryDescriptionComponent,
  ],
  templateUrl: "./student-dossier-information.component.html",
  styleUrl: "./student-dossier-information.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentDossierInformationComponent {
  entries = input.required<ReadonlyArray<StudentDossierEntry>>();
}
