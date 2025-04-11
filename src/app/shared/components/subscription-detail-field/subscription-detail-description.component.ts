import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { SubscriptionDetail } from "src/app/shared/models/subscription.model";
import { SubscriptionDetailLabelComponent } from "./subscription-detail-label.component";

@Component({
  selector: "bkd-subscription-detail-description",
  imports: [SubscriptionDetailLabelComponent],
  template: `
    <bkd-subscription-detail-label
      [detail]="detail()"
      [id]="id()"
      [hideLabel]="hideLabel()"
    ></bkd-subscription-detail-label>
    <div [id]="id()">{{ detail().Value }}</div>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubscriptionDetailDescriptionComponent {
  detail = input.required<SubscriptionDetail>();
  id = input.required<string>();
  hideLabel = input.required<boolean>();
}
