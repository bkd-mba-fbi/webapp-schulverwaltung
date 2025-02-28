import {
  ChangeDetectionStrategy,
  Component,
  Signal,
  computed,
  inject,
} from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { TranslatePipe } from "@ngx-translate/core";
import { SpinnerComponent } from "src/app/shared/components/spinner/spinner.component";
import { BkdModalService } from "src/app/shared/services/bkd-modal.service";
import { SubscriptionDetailEntry } from "../../services/import-file-subscription-details.service";
import { ImportStateService } from "../../services/import-state.service";
import {
  ImportValidateSubscriptionDetailsService,
  SubscriptionDetailImportEntry,
  ValidationProgress,
} from "../../services/import-validate-subscription-details.service";
import { ImportEntryStatusComponent } from "../import-entry-status/import-entry-status.component";
import { ImportEntryValueComponent } from "../import-entry-value/import-entry-value.component";
import { ImportProceedUploadDialogComponent } from "../import-proceed-upload-dialog/import-proceed-upload-dialog.component";

@Component({
  selector: "bkd-import-subscription-details-validation",
  imports: [
    TranslatePipe,
    RouterLink,
    SpinnerComponent,
    ImportEntryStatusComponent,
    ImportEntryValueComponent,
  ],
  templateUrl: "./import-subscription-details-validation.component.html",
  styleUrl: "./import-subscription-details-validation.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImportSubscriptionDetailsValidationComponent {
  private router = inject(Router);
  private stateService = inject(ImportStateService);
  private validationService = inject(ImportValidateSubscriptionDetailsService);
  private modalService = inject(BkdModalService);

  parsedEntries: Signal<ReadonlyArray<SubscriptionDetailEntry>> =
    this.stateService.parsedEntries;
  importEntries: Signal<ReadonlyArray<SubscriptionDetailImportEntry>> =
    this.stateService.importEntries;
  progress: Signal<ValidationProgress>;

  validImportEntries = computed(() =>
    this.importEntries().filter(
      ({ validationStatus }) => validationStatus !== "invalid",
    ),
  );
  invalidImportEntries = computed(() =>
    this.importEntries().filter(
      ({ validationStatus }) => validationStatus === "invalid",
    ),
  );
  sortedImportEntries = computed(() => [
    ...this.invalidImportEntries(),
    ...this.validImportEntries(),
  ]);

  constructor() {
    if (this.parsedEntries().length === 0) {
      this.navigateToFilePage();
    }

    const { progress, entries } = this.validationService.fetchAndValidate(
      this.parsedEntries(),
    );
    this.progress = progress;
    void entries.then((value) => this.stateService.importEntries.set(value));
  }

  proceedToUpload(): void {
    if (this.progress().invalid > 0) {
      this.openProceedDialog().closed.subscribe(() =>
        this.navigateToUploadPage(),
      );
    } else {
      this.navigateToUploadPage();
    }
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

  private openProceedDialog(): NgbModalRef {
    const modalRef = this.modalService.open(ImportProceedUploadDialogComponent);
    modalRef.componentInstance.invalidCount = this.progress().invalid;
    modalRef.componentInstance.validCount = this.progress().valid;
    return modalRef;
  }

  private navigateToFilePage(): void {
    void this.router.navigate(["/import"]);
  }

  private navigateToUploadPage(): void {
    void this.router.navigate(["/import/upload"]);
  }
}
