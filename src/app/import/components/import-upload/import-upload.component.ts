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
import { ImportEmailsService } from "../../services/import-emails.service.ts.service";
import { ImportSubscriptionDetailsService } from "../../services/import-subscription-details.service";

export const IMPORT_TYPES = ["subscriptionDetails", "emails"] as const;
export type ImportType = (typeof IMPORT_TYPES)[number];

@Component({
  selector: "bkd-import-upload",
  imports: [TranslatePipe, RouterLink],
  templateUrl: "./import-upload.component.html",
  styleUrl: "./import-upload.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImportUploadComponent {
  private importSubscriptionDetailsService = inject(
    ImportSubscriptionDetailsService,
  );
  private importEmailsService = inject(ImportEmailsService);

  availableImportTypes = IMPORT_TYPES;
  importType = signal<ImportType>(IMPORT_TYPES[0]);

  importService = computed(() => {
    const importType = this.importType();
    switch (importType) {
      case "subscriptionDetails":
        return this.importSubscriptionDetailsService;
      case "emails":
        return this.importEmailsService;
      default:
        throw new UnreachableError(importType, "Unhandeled import type");
    }
  });

  onFileInput(files: FileList | null): void {
    if (files) {
      this.importService().setFile(files.item(0));
    }
  }

  onFileDrag(event: DragEvent): void {
    event.preventDefault();
  }

  onFileDrop(event: DragEvent): void {
    event.preventDefault();
    const files = event.dataTransfer?.files;
    if (files) {
      this.importService().setFile(files.item(0));
    }
  }
}
