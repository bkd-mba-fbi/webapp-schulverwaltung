import { ChangeDetectionStrategy, Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";

@Component({
  selector: "bkd-import-subscription-details",
  imports: [RouterOutlet],
  templateUrl: "./import-subscription-details.component.html",
  styleUrl: "./import-subscription-details.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImportSubscriptionDetailsComponent {}
