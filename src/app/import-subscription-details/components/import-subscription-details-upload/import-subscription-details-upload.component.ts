import { ChangeDetectionStrategy, Component } from "@angular/core";
import { TranslatePipe } from "@ngx-translate/core";
import { read, utils } from "xlsx";

export type SubscriptionDetailData = {
  eventId: number;
  personId: number;
  subscriptionDetailId: number;
  value: string;
  personEmail?: string;
};

@Component({
  selector: "bkd-import-subscription-details-upload",
  imports: [TranslatePipe],
  templateUrl: "./import-subscription-details-upload.component.html",
  styleUrl: "./import-subscription-details-upload.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImportSubscriptionDetailsUploadComponent {
  rows: SubscriptionDetailData[] = [];

  async onFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    const ab = await file?.arrayBuffer();
    const wb = read(ab);
    const ws = wb.Sheets[wb.SheetNames[0]];
    const data = utils.sheet_to_json<SubscriptionDetailData>(ws);
    this.rows = data;
    console.log(data);
  }
}
