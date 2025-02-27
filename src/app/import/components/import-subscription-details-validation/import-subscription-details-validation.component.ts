import {
  ChangeDetectionStrategy,
  Component,
  Signal,
  computed,
  inject,
} from "@angular/core";
import { RouterLink } from "@angular/router";
import { TranslatePipe } from "@ngx-translate/core";
import { ProgressComponent } from "../../../shared/components/progress/progress.component";
import { SubscriptionDetailEntry } from "../../services/import-file-subscription-details.service";
import { ImportStateService } from "../../services/import-state.service";
import {
  ImportValidateSubscriptionDetailsService,
  SubscriptionDetailImportEntry,
  ValidationProgress,
} from "../../services/import-validate-subscription-details.service";
import { ImportEntryStatusComponent } from "../import-entry-status/import-entry-status.component";
import { ImportEntryValueComponent } from "../import-entry-value/import-entry-value.component";

@Component({
  selector: "bkd-import-subscription-details-validation",
  imports: [
    TranslatePipe,
    ProgressComponent,
    RouterLink,
    ImportEntryStatusComponent,
    ImportEntryValueComponent,
  ],
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

  sortedImportEntries = computed(() => {
    const valid = this.importEntries().filter(
      ({ validationStatus }) => validationStatus !== "invalid",
    );
    const invalid = this.importEntries().filter(
      ({ validationStatus }) => validationStatus === "invalid",
    );
    return [...invalid, ...valid];
  });

  constructor() {
    const { progress, entries } = this.validationService.fetchAndValidate(
      this.parsedEntries(),
    );
    this.progress = progress;
    void entries.then((value) => this.stateService.importEntries.set(value));
  }

  isValid(
    entry: SubscriptionDetailImportEntry,
    columns?: ReadonlyArray<string>,
  ) {
    return (
      entry.validationStatus !== "invalid" ||
      (columns &&
        !columns.some((column) =>
          entry.validationError?.columns.includes(column as never),
        ))
    );
  }

  getEventValue(entry: SubscriptionDetailImportEntry): unknown {
    if (entry.validationStatus === "invalid") {
      return entry.entry["eventId"];
    }
    return entry.data.event?.Designation;
  }

  getPersonValue(entry: SubscriptionDetailImportEntry): unknown {
    if (entry.validationStatus === "invalid") {
      return `${entry.entry["personId"]} ${entry.entry["personEmail"]}`;
    }

    return entry.data.person?.FullName;
  }

  getSubscriptionDetailValue(entry: SubscriptionDetailImportEntry): unknown {
    if (entry.validationStatus === "invalid") {
      return entry.entry["subscriptionDetailId"];
    }
    return entry.data.subscriptionDetail?.VssDesignation;
  }

  getValue(entry: SubscriptionDetailImportEntry): unknown {
    return entry.entry["value"];
  }
}
