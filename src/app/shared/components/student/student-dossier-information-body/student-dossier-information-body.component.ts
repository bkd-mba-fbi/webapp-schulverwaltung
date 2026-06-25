import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { TranslatePipe } from "@ngx-translate/core";
import { StudentDossierEntry } from "src/app/shared/services/student-dossier.service";
import { StudentDossierEntryDescriptionComponent } from "../student-dossier-entry-description/student-dossier-entry-description.component";
import { StudentDossierEntryFooterComponent } from "../student-dossier-entry-footer/student-dossier-entry-footer.component";

@Component({
  selector: "bkd-student-dossier-information-body",
  imports: [
    TranslatePipe,
    StudentDossierEntryDescriptionComponent,
    StudentDossierEntryFooterComponent,
  ],
  templateUrl: "./student-dossier-information-body.component.html",
  styleUrl: "./student-dossier-information-body.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentDossierInformationBodyComponent {
  informationEntries = input.required<ReadonlyArray<StudentDossierEntry>>();
  disadvantageEntries = input.required<ReadonlyArray<StudentDossierEntry>>();
}
