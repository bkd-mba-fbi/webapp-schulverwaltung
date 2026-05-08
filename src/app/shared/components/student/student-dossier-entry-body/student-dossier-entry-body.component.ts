import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from "@angular/core";
import { TranslatePipe } from "@ngx-translate/core";
import { SETTINGS, Settings } from "src/app/settings";
import { StorageService } from "src/app/shared/services/storage.service";
import { StudentDossierEntry } from "src/app/shared/services/student-dossier.service";
import { StudentDossierEntryDescriptionComponent } from "../student-dossier-entry-description/student-dossier-entry-description.component";
import { StudentDossierEntryFooterComponent } from "../student-dossier-entry-footer/student-dossier-entry-footer.component";

@Component({
  selector: "bkd-student-dossier-entry-body",
  imports: [
    StudentDossierEntryDescriptionComponent,
    StudentDossierEntryFooterComponent,
    TranslatePipe,
  ],
  templateUrl: "./student-dossier-entry-body.component.html",
  styleUrl: "./student-dossier-entry-body.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentDossierEntryBodyComponent {
  private settings = inject<Settings>(SETTINGS);
  private storageService = inject(StorageService);

  entry = input.required<StudentDossierEntry>();

  documentPath = computed(
    () =>
      // The path in the `File` attribute starts with `/restApi`, so we remove
      // this to have the actual document path without the API prefix
      this.entry().additionalInformation.File?.replace(/^\/restApi/, "") ??
      null,
  );
  hasDocument = computed(() => Boolean(this.documentPath()));

  openDocument(): void {
    // We generate the URL that includes the token when we are using it,
    // otherwise the token can already be expired (hence this openDocument()
    // call and no href="" attribute).
    const url = this.getDocumentUrl();
    if (url) {
      window.open(url, "_blank");
    }
  }

  private getDocumentUrl(): Option<string> {
    const documentPath = this.documentPath();
    if (!documentPath) {
      return null;
    }
    const token = this.storageService.getAccessToken();
    return `${this.settings.apiUrl}${documentPath}?token=${token}`;
  }
}
