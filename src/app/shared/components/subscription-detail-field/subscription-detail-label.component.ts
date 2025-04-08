import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  model,
} from "@angular/core";
import { SubscriptionDetail } from "src/app/shared/models/subscription.model";

@Component({
  selector: "bkd-subscription-detail-label",
  imports: [],
  template: `
    @if (!hideLabel()) {
      <label [attr.for]="id()" class="form-label" [title]="detail().Tooltip">
        {{ detail().VssDesignation }}
        {{ required() ? "*" : "" }}
      </label>
    }
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubscriptionDetailLabelComponent {
  detail = model.required<SubscriptionDetail>();
  id = input.required<string>();
  hideLabel = input.required<boolean>();

  required = computed(() => this.detail().VssInternet === "M");
}
