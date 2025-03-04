import {
  ChangeDetectionStrategy,
  Component,
  WritableSignal,
  computed,
  inject,
} from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { TranslatePipe, TranslateService } from "@ngx-translate/core";
import { NotificationComponent } from "../../../shared/components/notification/notification.component";
import { ProgressComponent } from "../../../shared/components/progress/progress.component";
import { ImportStateService } from "../../services/import-state.service";
import { ImportUploadSubscriptionDetailsService } from "../../services/import-upload-subscription-details.service";
import { SubscriptionDetailImportEntry } from "../../services/import-validate-subscription-details.service";
import { ImportEntryStatusComponent } from "../import-entry-status/import-entry-status.component";
import { ImportEntryValueComponent } from "../import-entry-value/import-entry-value.component";

@Component({
  selector: "bkd-import-subscription-details-upload",
  imports: [
    RouterLink,
    TranslatePipe,
    ProgressComponent,
    NotificationComponent,
    ImportEntryStatusComponent,
    ImportEntryValueComponent,
  ],
  templateUrl: "./import-subscription-details-upload.component.html",
  styleUrl: "./import-subscription-details-upload.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImportSubscriptionDetailsUploadComponent {
  private router = inject(Router);
  private translate = inject(TranslateService);
  private stateService = inject(ImportStateService);
  private uploadService = inject(ImportUploadSubscriptionDetailsService);

  importEntries: WritableSignal<
    Option<ReadonlyArray<SubscriptionDetailImportEntry>>
  > = this.stateService.importEntries;
  errorEntries = computed(
    () =>
      this.importEntries()?.filter(
        ({ importStatus }) => importStatus === "error",
      ) ?? [],
  );
  progress = this.uploadService.progress;

  constructor() {
    const importEntries = this.importEntries();
    if (importEntries === null || importEntries.length === 0) {
      this.navigateToFilePage();
      return;
    }

    this.upload(importEntries);
  }

  retry() {
    this.upload(this.importEntries() ?? [], { retryFailedOnly: true });
  }

  getErrorMessage(entry: SubscriptionDetailImportEntry): Option<string> {
    if (entry.importStatus === "error" && entry.importError) {
      return this.translate.instant("import.upload.error.entry-error");
    }
    return null;
  }

  private upload(
    importEntries: ReadonlyArray<SubscriptionDetailImportEntry>,
    options: { retryFailedOnly?: boolean } = { retryFailedOnly: false },
  ): void {
    void this.uploadService
      .upload(importEntries, options)
      .then((entries) => this.importEntries.set(entries));
  }

  private navigateToFilePage(): void {
    void this.router.navigate(["/import"]);
  }
}
