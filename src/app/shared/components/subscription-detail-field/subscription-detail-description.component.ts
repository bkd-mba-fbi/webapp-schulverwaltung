import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { SubscriptionDetail } from "src/app/shared/models/subscription.model";

@Component({
  selector: "bkd-subscription-detail-description",
  imports: [],
  template: ` <div [id]="id()">{{ detail().Value }}</div> `,
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubscriptionDetailDescriptionComponent {
  readonly detail = input.required<SubscriptionDetail>();
  readonly id = input.required<string>();
}
