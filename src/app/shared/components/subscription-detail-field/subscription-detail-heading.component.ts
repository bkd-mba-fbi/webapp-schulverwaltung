import { ChangeDetectionStrategy, Component, model } from "@angular/core";
import { SubscriptionDetail } from "src/app/shared/models/subscription.model";

@Component({
  selector: "bkd-subscription-detail-heading",
  imports: [],
  template: `
    <div [title]="detail().Tooltip">
      {{ detail().VssDesignation }}
    </div>
  `,
  styles: `
    :host {
      font-weight: bold;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubscriptionDetailHeadingComponent {
  detail = model.required<SubscriptionDetail>();
}
