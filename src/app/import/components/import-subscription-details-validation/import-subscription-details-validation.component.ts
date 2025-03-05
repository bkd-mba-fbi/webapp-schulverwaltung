import {
  ChangeDetectionStrategy,
  Component,
  WritableSignal,
  computed,
  inject,
} from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { TranslatePipe, TranslateService } from "@ngx-translate/core";
import { SpinnerComponent } from "src/app/shared/components/spinner/spinner.component";
import { BkdModalService } from "src/app/shared/services/bkd-modal.service";
import { ToastService } from "src/app/shared/services/toast.service";
import { SubscriptionDetailEntry } from "../../services/import-file-subscription-details.service";
import {
  ImportStateService,
  ValidationStatus,
} from "../../services/import-state.service";
import {
  ImportValidateSubscriptionDetailsService,
  SubscriptionDetailImportEntry,
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
  private translate = inject(TranslateService);
  private stateService = inject(ImportStateService);
  private validationService = inject(ImportValidateSubscriptionDetailsService);
  private modalService = inject(BkdModalService);
  private toastService = inject(ToastService);

  parsedEntries: WritableSignal<
    Option<ReadonlyArray<SubscriptionDetailEntry>>
  > = this.stateService.parsedEntries;
  importEntries: WritableSignal<
    Option<ReadonlyArray<SubscriptionDetailImportEntry>>
  > = this.stateService.importEntries;

  isValidating = computed(() => this.importEntries() === null);

  validEntries = computed(() => this.getEntriesByStatus("valid"));
  validCount = computed(() => this.validEntries().length);

  invalidEntries = computed(() => this.getEntriesByStatus("invalid"));
  invalidCount = computed(() => this.invalidEntries().length);

  sortedEntries = computed(() => [
    ...this.invalidEntries(),
    ...this.validEntries(),
  ]);

  constructor() {
    const parsedEntries = this.parsedEntries();
    if (parsedEntries === null || parsedEntries.length === 0) {
      this.navigateToFilePage();
      return;
    }

    this.importEntries.set(null); // Clear old state
    void this.validationService
      .fetchAndValidate(parsedEntries)
      .then((entries) => this.stateService.importEntries.set(entries));
  }

  proceedToUpload(): void {
    if (this.validCount() === 0) {
      this.toastService.error(
        this.translate.instant("import.validation.proceed-no-valid"),
      );
    } else if (this.invalidCount() > 0) {
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
  ): boolean {
    return Boolean(
      entry.validationStatus !== "invalid" ||
        (columns &&
          !columns.some((column) =>
            entry.validationError?.columns.includes(column as never),
          )),
    );
  }

  getErrorMessage(entry: SubscriptionDetailImportEntry): Option<string> {
    if (entry.validationStatus === "invalid" && entry.validationError) {
      return this.translate.instant(
        `import.validation.errors.${entry.validationError.type}`,
      );
    }
    return null;
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

  private getEntriesByStatus(
    status: ValidationStatus,
  ): ReadonlyArray<SubscriptionDetailImportEntry> {
    return (this.importEntries() ?? []).filter(
      ({ validationStatus }) => validationStatus === status,
    );
  }

  private openProceedDialog(): NgbModalRef {
    const modalRef = this.modalService.open(ImportProceedUploadDialogComponent);
    modalRef.componentInstance.invalidCount = this.invalidCount();
    modalRef.componentInstance.validCount = this.validCount();
    return modalRef;
  }

  private navigateToFilePage(): void {
    void this.router.navigate(["/import"]);
  }

  private navigateToUploadPage(): void {
    void this.router.navigate(["/import/upload"]);
  }
}
