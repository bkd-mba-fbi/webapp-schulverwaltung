import { NgTemplateOutlet } from "@angular/common";
import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { Params, RouterLink } from "@angular/router";
import { TranslatePipe } from "@ngx-translate/core";

@Component({
  selector: "bkd-dashboard-action",
  templateUrl: "./dashboard-action.component.html",
  styleUrls: ["./dashboard-action.component.scss"],
  imports: [RouterLink, NgTemplateOutlet, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardActionComponent {
  readonly label = input.required<string>();
  readonly count = input<Option<number>>(null);
  readonly link = input<ReadonlyArray<string>>();
  readonly linkParams = input<Params>();
  readonly externalLink = input<Option<string>>();
}
