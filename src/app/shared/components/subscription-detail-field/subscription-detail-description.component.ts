import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { SubscriptionDetail } from "src/app/shared/models/subscription.model";

@Component({
  selector: "bkd-subscription-detail-description",
  imports: [],
  template: ` <div [id]="id()">{{ detail().Value }}</div> `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubscriptionDetailDescriptionComponent {
  detail = input.required<SubscriptionDetail>();
  id = input.required<string>();
}
