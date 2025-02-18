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
import { ImportParseEmailsService } from "../../services/import-parse-emails.service";
import { ImportParseSubscriptionDetailsService } from "../../services/import-parse-subscription-details.service";
import { ParseError } from "../../services/import-parse.service";
import {
  IMPORT_TYPES,
  ImportStateService,
} from "../../services/import-state.service";

@Component({
  selector: "bkd-import-upload",
  imports: [JsonPipe, TranslatePipe, RouterLink],
  templateUrl: "./import-upload.component.html",
  styleUrl: "./import-upload.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImportUploadComponent {
  private parseSubscriptionDetailsService = inject(
    ImportParseSubscriptionDetailsService,
  );
  private parseEmailsService = inject(ImportParseEmailsService);

  availableImportTypes = IMPORT_TYPES;

  stateService = inject(ImportStateService);
  parseService = computed(() => {
    const importType = this.stateService.importType();
    switch (importType) {
      case "subscriptionDetails":
        return this.parseSubscriptionDetailsService;
      case "emails":
        return this.parseEmailsService;
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
      const { error, headers, entries } =
        await this.parseService().parseAndVerify(file);
      this.error.set(error);
      this.stateService.headers.set(headers);
      this.stateService.parsedEntries.set(entries);
    }
  }
}
