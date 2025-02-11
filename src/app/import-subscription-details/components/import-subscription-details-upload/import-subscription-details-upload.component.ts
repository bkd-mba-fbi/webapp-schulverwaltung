import { ChangeDetectionStrategy, Component } from "@angular/core";
import { TranslatePipe } from "@ngx-translate/core";

@Component({
  selector: "bkd-import-subscription-details-upload",
  imports: [TranslatePipe],
  templateUrl: "./import-subscription-details-upload.component.html",
  styleUrl: "./import-subscription-details-upload.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImportSubscriptionDetailsUploadComponent {
  onFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    console.log(file);
  }
}
