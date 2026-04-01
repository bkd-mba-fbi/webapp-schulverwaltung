import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from "@angular/core";
import { SETTINGS, Settings } from "src/app/settings";
import { StudentDossierEntry } from "src/app/shared/services/student-dossier.service";
import { SafeHtmlPipe } from "../../../pipes/safe-html.pipe";

@Component({
  selector: "bkd-student-dossier-entry-description",
  imports: [SafeHtmlPipe],
  templateUrl: "./student-dossier-entry-description.component.html",
  styleUrl: "./student-dossier-entry-description.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentDossierEntryDescriptionComponent {
  private settings = inject<Settings>(SETTINGS);

  entry = input.required<StudentDossierEntry>();
  showDescription = computed(
    () =>
      // For entries created via email, the .eml file is referenced in the
      // `File` attribute, so we don't render the (HTML-)content
      this.entry().additionalInformation.TypeId !==
      this.settings.dossierEntryEmailTypeId,
  );
}
