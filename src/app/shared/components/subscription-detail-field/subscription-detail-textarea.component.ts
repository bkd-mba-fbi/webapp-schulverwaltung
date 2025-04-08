import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  model,
  signal,
} from "@angular/core";
import { SubscriptionDetail } from "src/app/shared/models/subscription.model";
import { SubscriptionDetailLabelComponent } from "./subscription-detail-label.component";

@Component({
  selector: "bkd-subscription-detail-textarea",
  imports: [SubscriptionDetailLabelComponent],
  template: `
    @let value = valueSignal();

    <bkd-subscription-detail-label
      [detail]="detail()"
      [id]="id()"
      [hideLabel]="hideLabel()"
    ></bkd-subscription-detail-label>
    <textarea
      class="form-control"
      [id]="id()"
      [value]="value()"
      [disabled]="readonly()"
      (input)="onInput($event)"
    ></textarea>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubscriptionDetailTextareaComponent {
  detail = model.required<SubscriptionDetail>();
  id = input.required<string>();
  hideLabel = input.required<boolean>();

  readonly = computed(() => this.detail().VssInternet === "R");
  required = computed(() => this.detail().VssInternet === "M");
  valueSignal = computed(() => signal(this.detail().Value));

  onInput(event: Event) {
    const target = event.target as HTMLTextAreaElement;
    const value = this.valueSignal();
    value.set(target.value);
  }
}
