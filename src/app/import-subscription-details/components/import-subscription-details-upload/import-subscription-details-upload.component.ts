import { AsyncPipe } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { TranslatePipe } from "@ngx-translate/core";
import { ImportSubscriptionDetailsStateService } from "../../services/import-subscription-details-state.service";

@Component({
  selector: "bkd-import-subscription-details-upload",
  imports: [TranslatePipe, AsyncPipe],
  templateUrl: "./import-subscription-details-upload.component.html",
  styleUrl: "./import-subscription-details-upload.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImportSubscriptionDetailsUploadComponent {
  stateService = inject(ImportSubscriptionDetailsStateService);

  onFileInput(files: FileList | null): void {
    if (files) {
      this.stateService.setFile(files.item(0));
    }
  }

  onFileDrag(event: DragEvent): void {
    event.preventDefault();
  }

  onFileDrop(event: DragEvent): void {
    event.preventDefault();
    const files = event.dataTransfer?.files;
    if (files) {
      this.stateService.setFile(files.item(0));
    }
  }
}
