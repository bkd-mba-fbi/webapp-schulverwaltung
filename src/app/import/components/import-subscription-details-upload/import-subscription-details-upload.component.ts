import {
  ChangeDetectionStrategy,
  Component,
  Signal,
  signal,
} from "@angular/core";
import { TranslatePipe } from "@ngx-translate/core";
import { NotificationComponent } from "../../../shared/components/notification/notification.component";
import { ProgressComponent } from "../../../shared/components/progress/progress.component";
import { UploadProgress } from "../../services/import-upload-subscription-details.service";

@Component({
  selector: "bkd-import-subscription-details-upload",
  imports: [TranslatePipe, ProgressComponent, NotificationComponent],
  templateUrl: "./import-subscription-details-upload.component.html",
  styleUrl: "./import-subscription-details-upload.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImportSubscriptionDetailsUploadComponent {
  progress: Signal<UploadProgress>;

  constructor() {
    // TODO implement
    this.progress = signal<UploadProgress>({
      uploading: 75,
      success: 20,
      error: 5,
      total: 100,
    });
  }

  retry() {
    // TODO implement
    console.log("retry");
  }
}
