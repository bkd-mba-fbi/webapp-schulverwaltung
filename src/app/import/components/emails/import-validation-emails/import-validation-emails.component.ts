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
import { EmailEntry } from "src/app/import/services/emails/import-file-emails.service";
import {
  EmailImportEntry,
  ImportValidateEmailsService,
} from "src/app/import/services/emails/import-validate-emails.service";
import { SpinnerComponent } from "src/app/shared/components/spinner/spinner.component";
import { BkdModalService } from "src/app/shared/services/bkd-modal.service";
import { ToastService } from "src/app/shared/services/toast.service";
import { ImportEntryStatusComponent } from "../../common/import-entry-status/import-entry-status.component";
import { ImportEntryValueComponent } from "../../common/import-entry-value/import-entry-value.component";
import { ImportProceedUploadDialogComponent } from "../../common/import-proceed-upload-dialog/import-proceed-upload-dialog.component";

@Component({
  selector: "bkd-import-validation-emails",
  imports: [
    TranslatePipe,
    RouterLink,
    SpinnerComponent,
    ImportEntryStatusComponent,
    ImportEntryValueComponent,
  ],
  templateUrl: "./import-validation-emails.component.html",
  styleUrl: "./import-validation-emails.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImportValidationEmailsComponent {
  private readonly router = inject(Router);
  private readonly translate = inject(TranslateService);
  private readonly stateService = inject(ImportStateService);
  private readonly validationService = inject(ImportValidateEmailsService);
  private readonly modalService = inject(BkdModalService);
  private readonly toastService = inject(ToastService);

  private readonly parsedEntries: WritableSignal<
    Option<ReadonlyArray<EmailEntry>>
  > = this.stateService.parsedEntries;
  private readonly importEntries: WritableSignal<
    Option<ReadonlyArray<EmailImportEntry>>
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

  isValid(entry: EmailImportEntry, columns?: ReadonlyArray<string>): boolean {
    return Boolean(
      entry.validationStatus !== "invalid" ||
      (columns &&
        !columns.some((column) =>
          entry.validationError?.columns.includes(column as never),
        )),
    );
  }

  protected getErrorMessage(entry: EmailImportEntry): Option<string> {
    if (entry.validationStatus === "invalid" && entry.validationError) {
      return this.translate.instant(
        `import.validation.errors.${entry.validationError.type}`,
      );
    }
    return null;
  }

  getPersonValue(entry: EmailImportEntry): unknown {
    if (entry.validationStatus === "invalid") {
      return entry.entry["personId"];
    }

    return entry.data.person?.FullName;
  }

  getEmailValue(entry: EmailImportEntry): unknown {
    return entry.entry["personEmail"];
  }

  private getEntriesByStatus(
    status: ValidationStatus,
  ): ReadonlyArray<EmailImportEntry> {
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
