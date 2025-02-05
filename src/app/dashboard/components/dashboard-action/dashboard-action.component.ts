import { NgTemplateOutlet } from "@angular/common";
import { Component, Input, input } from "@angular/core";
import { Params, RouterLink } from "@angular/router";
import { TranslatePipe } from "@ngx-translate/core";

@Component({
  selector: "bkd-dashboard-action",
  templateUrl: "./dashboard-action.component.html",
  styleUrls: ["./dashboard-action.component.scss"],
  imports: [RouterLink, NgTemplateOutlet, TranslatePipe],
})
export class DashboardActionComponent {
  @Input() label: string;
  @Input() count?: number | boolean;
  readonly link = input<string[]>();
  readonly linkParams = input<Params>();
  @Input() externalLink?: string;

  constructor() {}

  hasCount(count?: number | boolean): boolean {
    return typeof count === "number" && count >= 0;
  }
}
