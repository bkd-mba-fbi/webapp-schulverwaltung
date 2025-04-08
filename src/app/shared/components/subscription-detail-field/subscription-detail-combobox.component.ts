import {
  ChangeDetectionStrategy,
  Component,
  input,
  model,
} from "@angular/core";
import { SubscriptionDetail } from "src/app/shared/models/subscription.model";
import { SubscriptionDetailLabelComponent } from "./subscription-detail-label.component";

@Component({
  selector: "bkd-subscription-detail-combobox",
  imports: [SubscriptionDetailLabelComponent],
  template: `
    <bkd-subscription-detail-label
      [detail]="detail()"
      [id]="id()"
      [hideLabel]="hideLabel()"
    ></bkd-subscription-detail-label>
    <div [id]="id()">{{ detail().Value }} (TODO)</div>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubscriptionDetailComboboxComponent {
  detail = model.required<SubscriptionDetail>();
  id = input.required<string>();
  hideLabel = input.required<boolean>();
}
