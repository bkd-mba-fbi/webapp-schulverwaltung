import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { ImportStateService } from "src/app/import/services/common/import-state.service";
import { ImportValidationEmailsComponent } from "../../emails/import-validation-emails/import-validation-emails.component";
import { ImportValidationSubscriptionDetailsComponent } from "../../subscription-details/import-validation-subscription-details/import-validation-subscription-details.component";

@Component({
  selector: "bkd-import-validation",
  imports: [
    ImportValidationSubscriptionDetailsComponent,
    ImportValidationEmailsComponent,
  ],
  template: `
    @switch (stateService.importType()) {
      @case ("subscriptionDetails") {
        <bkd-import-validation-subscription-details></bkd-import-validation-subscription-details>
      }
      @case ("emails") {
        <bkd-import-validation-emails></bkd-import-validation-emails>
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImportValidationComponent {
  stateService = inject(ImportStateService);
}
