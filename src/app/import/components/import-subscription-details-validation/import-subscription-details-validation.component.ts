import {
  ChangeDetectionStrategy,
  Component,
  Signal,
  inject,
} from "@angular/core";
import { TranslatePipe } from "@ngx-translate/core";
import { BacklinkComponent } from "../../../shared/components/backlink/backlink.component";
import { ProgressComponent } from "../../../shared/components/progress/progress.component";
import { SubscriptionDetailEntry } from "../../services/import-parse-subscription-details.service";
import { ImportStateService } from "../../services/import-state.service";
import {
  ImportValidateSubscriptionDetailsService,
  SubscriptionDetailImportEntry,
  ValidationProgress,
} from "../../services/import-validate-subscription-details.service";

@Component({
  selector: "bkd-import-subscription-details-validation",
  imports: [TranslatePipe, BacklinkComponent, ProgressComponent],
  templateUrl: "./import-subscription-details-validation.component.html",
  styleUrl: "./import-subscription-details-validation.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImportSubscriptionDetailsValidationComponent {
  stateService = inject(ImportStateService);
  validationService = inject(ImportValidateSubscriptionDetailsService);

  parsedEntries: Signal<ReadonlyArray<SubscriptionDetailEntry>> =
    this.stateService.parsedEntries;
  importEntries: Signal<ReadonlyArray<SubscriptionDetailImportEntry>> =
    this.stateService.importEntries;
  progress: Signal<ValidationProgress>;

  constructor() {
    const { progress, entries } = this.validationService.fetchAndValidate(
      this.parsedEntries(),
    );
    this.progress = progress;
    void entries.then((value) => this.stateService.importEntries.set(value));
  }
}
