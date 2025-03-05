import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { ImportStateService } from "src/app/import/services/common/import-state.service";
import { ImportUploadEmailsComponent } from "../../emails/import-upload-emails/import-upload-emails.component";
import { ImportUploadSubscriptionDetailsComponent } from "../../subscription-details/import-upload-subscription-details/import-upload-subscription-details.component";

@Component({
  selector: "bkd-import-upload",
  imports: [
    ImportUploadSubscriptionDetailsComponent,
    ImportUploadEmailsComponent,
  ],
  template: `
    @switch (stateService.importType()) {
      @case ("subscriptionDetails") {
        <bkd-import-upload-subscription-details></bkd-import-upload-subscription-details>
      }
      @case ("emails") {
        <bkd-import-upload-emails></bkd-import-upload-emails>
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImportUploadComponent {
  stateService = inject(ImportStateService);
}
