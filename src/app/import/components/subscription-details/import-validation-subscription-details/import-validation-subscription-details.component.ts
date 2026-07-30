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
import {
  ImportStateService,
  ValidationStatus,
} from "src/app/import/services/common/import-state.service";
import { SubscriptionDetailEntry } from "src/app/import/services/subscription-details/import-file-subscription-details.service";
import {
  ImportValidateSubscriptionDetailsService,
  SubscriptionDetailImportEntry,
} from "src/app/import/services/subscription-details/import-validate-subscription-details.service";
import { SpinnerComponent } from "src/app/shared/components/spinner/spinner.component";
import { BkdModalService } from "src/app/shared/services/bkd-modal.service";
import { ToastService } from "src/app/shared/services/toast.service";
import { ImportEntryStatusComponent } from "../../common/import-entry-status/import-entry-status.component";
import { ImportEntryValueComponent } from "../../common/import-entry-value/import-entry-value.component";
import { ImportProceedUploadDialogComponent } from "../../common/import-proceed-upload-dialog/import-proceed-upload-dialog.component";

@Component({
  selector: "bkd-import-validation-subscription-details",
  imports: [
    TranslatePipe,
    RouterLink,
    SpinnerComponent,
    ImportEntryStatusComponent,
    ImportEntryValueComponent,
  ],
  templateUrl: "./import-validation-subscription-details.component.html",
  styleUrl: "./import-validation-subscription-details.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImportValidationSubscriptionDetailsComponent {
  private readonly router = inject(Router);
  private readonly translate = inject(TranslateService);
  private readonly stateService = inject(ImportStateService);
  private readonly validationService = inject(
    ImportValidateSubscriptionDetailsService,
  );
  private readonly modalService = inject(BkdModalService);
  private readonly toastService = inject(ToastService);

  private readonly parsedEntries: WritableSignal<
    Option<ReadonlyArray<SubscriptionDetailEntry>>
  > = this.stateService.parsedEntries;
  private readonly importEntries: WritableSignal<
    Option<ReadonlyArray<SubscriptionDetailImportEntry>>
  > = this.stateService.importEntries;

  protected readonly isValidating = computed(
    () => this.importEntries() === null,
  );

  private readonly validEntries = computed(() =>
    this.getEntriesByStatus("valid"),
  );
  private readonly validCount = computed(() => this.validEntries().length);

  private readonly invalidEntries = computed(() =>
    this.getEntriesByStatus("invalid"),
  );
  private readonly invalidCount = computed(() => this.invalidEntries().length);

  protected readonly sortedEntries = computed(() => [
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

  protected proceedToUpload(): void {
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

  protected getErrorMessage(
    entry: SubscriptionDetailImportEntry,
  ): Option<string> {
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
      return (entry.entry["personId"] || entry.entry["personEmail"]) ?? "";
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
    modalRef.setInput("invalidCount", this.invalidCount());
    modalRef.setInput("validCount", this.validCount());
    return modalRef;
  }

  private navigateToFilePage(): void {
    void this.router.navigate(["/import"]);
  }

  private navigateToUploadPage(): void {
    void this.router.navigate(["/import/upload"]);
  }
}
