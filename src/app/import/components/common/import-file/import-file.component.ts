import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  computed,
  effect,
  inject,
  signal,
  viewChild,
} from "@angular/core";
import { RouterLink } from "@angular/router";
import { TranslatePipe, TranslateService } from "@ngx-translate/core";
import {
  ButtonGroupComponent,
  ButtonGroupOption,
} from "src/app/shared/components/button-group/button-group.component";
import { UnreachableError } from "src/app/shared/utils/error";
import {
  MissingColumnsError,
  ParseError,
} from "../../../services/common/import-file.service";
import {
  IMPORT_TYPES,
  ImportStateService,
  ImportType,
} from "../../../services/common/import-state.service";
import { ImportFileEmailsService } from "../../../services/emails/import-file-emails.service";
import { ImportFileSubscriptionDetailsService } from "../../../services/subscription-details/import-file-subscription-details.service";

@Component({
  selector: "bkd-import-file",
  imports: [TranslatePipe, RouterLink, ButtonGroupComponent],
  templateUrl: "./import-file.component.html",
  styleUrl: "./import-file.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImportFileComponent implements OnDestroy, AfterViewInit {
  private translate = inject(TranslateService);
  private fileSubscriptionDetailsService = inject(
    ImportFileSubscriptionDetailsService,
  );
  private fileEmailsService = inject(ImportFileEmailsService);
  stateService = inject(ImportStateService);

  importTypeOptions: ReadonlyArray<ButtonGroupOption<ImportType>> =
    IMPORT_TYPES.map((key) => ({
      key,
      label: this.translate.instant(`import.file.types.${key}`),
    }));
  importTypeOption = signal<Option<ButtonGroupOption<ImportType>>>(
    this.importTypeOptions[0],
  );

  fileService = computed(() => {
    const importType = this.stateService.importType();
    switch (importType) {
      case "subscriptionDetails":
        return this.fileSubscriptionDetailsService;
      case "emails":
        return this.fileEmailsService;
      default:
        throw new UnreachableError(importType, "Unhandled import type");
    }
  });
  requiredColumnNames = computed(() =>
    new Array(this.fileService().requiredColumns)
      .fill("")
      .map((_, i) =>
        this.translate.instant(
          `import.${this.stateService.importType()}.data-columns.column${i + 1}`,
        ),
      ),
  );

  error = signal<Option<ParseError>>(null);
  errorMessage = computed(() => {
    const error = this.error();
    if (!error) return null;

    const key = `import.file.errors.${error.type}`;
    const params =
      error instanceof MissingColumnsError
        ? {
            actualColumns: error.actualColumns,
            requiredColumns: error.requiredColumns,
          }
        : {};
    return this.translate.instant(key, params);
  });

  dragging = signal(false); // Used to show the drop zone when dragging a file into the viewport
  private dragCount = 0;

  private fileInput =
    viewChild.required<ElementRef<HTMLInputElement>>("fileInput");

  constructor() {
    // Reset state when visiting this page
    this.stateService.file.set(null);
    this.stateService.parsedEntries.set([]);

    // Propagate import type update to state service
    effect(() => {
      const importType = this.importTypeOption()?.key;
      if (importType) {
        this.stateService.importType.set(importType);
      }
    });

    // Parse & verify file when selected or import type changes
    effect(() => {
      const file = this.stateService.file();
      if (file) {
        void this.fileService()
          .parseAndVerify(file)
          .then(({ error, entries }) => {
            this.error.set(error);
            this.stateService.parsedEntries.set(entries);
          });
      }
    });
  }

  ngAfterViewInit(): void {
    document.addEventListener("dragenter", this.onDragEnter);
    document.addEventListener("dragleave", this.onDragLeave);
  }

  ngOnDestroy(): void {
    document.removeEventListener("dragenter", this.onDragEnter);
    document.removeEventListener("dragleave", this.onDragLeave);
  }

  onFileInput(files: FileList | null): void {
    this.stateService.file.set(files?.item(0) ?? null);
  }

  onDragEnter = () => {
    this.dragCount += 1;
    if (this.dragCount === 1) {
      this.dragging.set(true);
    }
  };

  onDragLeave = () => {
    this.dragCount -= 1;
    if (this.dragCount === 0) {
      this.dragging.set(false);
    }
  };

  onFileDrag(event: DragEvent): void {
    event.preventDefault();
  }

  onFileDrop(event: DragEvent): void {
    event.preventDefault();

    this.dragCount = 0;
    this.dragging.set(false);

    const input = this.fileInput().nativeElement;
    input.files = event.dataTransfer?.files ?? null;
    input.dispatchEvent(new Event("change"));
  }
}
