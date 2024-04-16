import { NgIf, NgTemplateOutlet } from "@angular/common";
import { Component, Input } from "@angular/core";
import { Params, RouterLink } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";

@Component({
  selector: "erz-dashboard-action",
  templateUrl: "./dashboard-action.component.html",
  styleUrls: ["./dashboard-action.component.scss"],
  standalone: true,
  imports: [NgIf, RouterLink, NgTemplateOutlet, TranslateModule],
})
export class DashboardActionComponent {
  @Input() label: string;
  @Input() count?: number;
  @Input() link?: string[];
  @Input() linkParams?: Params;
  @Input() externalLink?: string;
  constructor() {}
}
