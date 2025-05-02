import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";
import { SubscriptionDetail } from "src/app/shared/models/subscription.model";

@Component({
  selector: "bkd-subscription-detail-heading",
  imports: [NgbTooltipModule],
  template: `
    <div [ngbTooltip]="detail().Tooltip ?? ''">
      {{ detail().VssDesignation }}
    </div>
  `,
  styles: `
    :host {
      display: block;
      font-weight: bold;
    }
    div {
      display: inline-flex; /* Fix tooltip placement */
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubscriptionDetailHeadingComponent {
  detail = input.required<SubscriptionDetail>();
}
