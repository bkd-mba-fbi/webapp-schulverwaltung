import { JsonPipe } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from "@angular/core";
import { RouterLink } from "@angular/router";
import { TranslatePipe } from "@ngx-translate/core";
import { UnreachableError } from "src/app/shared/utils/error";
import { ImportFileEmailsService } from "../../services/import-file-emails.service";
import { ImportFileSubscriptionDetailsService } from "../../services/import-file-subscription-details.service";
import { ParseError } from "../../services/import-file.service";
import {
  IMPORT_TYPES,
  ImportStateService,
} from "../../services/import-state.service";

@Component({
  selector: "bkd-import-file",
  imports: [JsonPipe, TranslatePipe, RouterLink],
  templateUrl: "./import-file.component.html",
  styleUrl: "./import-file.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImportFileComponent {
  private fileSubscriptionDetailsService = inject(
    ImportFileSubscriptionDetailsService,
  );
  private fileEmailsService = inject(ImportFileEmailsService);

  availableImportTypes = IMPORT_TYPES;

  stateService = inject(ImportStateService);
  fileService = computed(() => {
    const importType = this.stateService.importType();
    switch (importType) {
      case "subscriptionDetails":
        return this.fileSubscriptionDetailsService;
      case "emails":
        return this.fileEmailsService;
      default:
        throw new UnreachableError(importType, "Unhandeled import type");
    }
  });

  error = signal<Option<ParseError>>(null);

  onFileInput(files: FileList | null): void {
    void this.setFile(files?.item(0) ?? null);
  }

  onFileDrag(event: DragEvent): void {
    event.preventDefault();
  }

  onFileDrop(event: DragEvent): void {
    event.preventDefault();
    const files = event.dataTransfer?.files;
    void this.setFile(files?.item(0) ?? null);
  }

  private async setFile(file: Option<File>): Promise<void> {
    this.stateService.file.set(file);
    if (file) {
      const { error, entries } = await this.fileService().parseAndVerify(file);
      this.error.set(error);
      this.stateService.parsedEntries.set(entries);
    }
  }
}
