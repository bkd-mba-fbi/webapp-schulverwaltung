import { DatePipe } from "@angular/common";
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

@Component({
  selector: "bkd-student-dossier-entry-body",
  imports: [StudentDossierEntryDescriptionComponent, DatePipe, TranslatePipe],
  templateUrl: "./student-dossier-entry-body.component.html",
  styleUrl: "./student-dossier-entry-body.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentDossierEntryBodyComponent {
  private settings = inject<Settings>(SETTINGS);
  private storageService = inject(StorageService);

  entry = input.required<StudentDossierEntry>();

  documentUrl = computed(() => {
    const filePath = this.entry().additionalInformation.File;
    if (!filePath) {
      return null;
    }
    return `${this.settings.apiUrl}${filePath.replace(/^\/restApi/, "")}?token=${this.storageService.getAccessToken()}`;
  });
}
