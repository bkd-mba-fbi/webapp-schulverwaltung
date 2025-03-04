import {
  ChangeDetectionStrategy,
  Component,
  WritableSignal,
  inject,
} from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { TranslatePipe } from "@ngx-translate/core";
import { NotificationComponent } from "../../../shared/components/notification/notification.component";
import { ProgressComponent } from "../../../shared/components/progress/progress.component";
import { ImportStateService } from "../../services/import-state.service";
import { ImportUploadSubscriptionDetailsService } from "../../services/import-upload-subscription-details.service";
import { SubscriptionDetailImportEntry } from "../../services/import-validate-subscription-details.service";

@Component({
  selector: "bkd-import-subscription-details-upload",
  imports: [
    RouterLink,
    TranslatePipe,
    ProgressComponent,
    NotificationComponent,
  ],
  templateUrl: "./import-subscription-details-upload.component.html",
  styleUrl: "./import-subscription-details-upload.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImportSubscriptionDetailsUploadComponent {
  private router = inject(Router);
  private stateService = inject(ImportStateService);
  private uploadService = inject(ImportUploadSubscriptionDetailsService);

  importEntries: WritableSignal<
    Option<ReadonlyArray<SubscriptionDetailImportEntry>>
  > = this.stateService.importEntries;
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
    // TODO implement
    console.log("retry");

    this.upload(this.importEntries() ?? [], { retryFailedOnly: true });
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
