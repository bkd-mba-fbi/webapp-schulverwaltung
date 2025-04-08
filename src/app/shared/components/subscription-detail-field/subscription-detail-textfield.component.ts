import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  model,
  signal,
} from "@angular/core";
import {
  SubscriptionDetail,
  SubscriptionDetailType,
} from "src/app/shared/models/subscription.model";
import { SubscriptionDetailLabelComponent } from "./subscription-detail-label.component";

@Component({
  selector: "bkd-subscription-detail-textfield",
  imports: [SubscriptionDetailLabelComponent],
  template: `
    @let value = valueSignal();

    <bkd-subscription-detail-label
      [detail]="detail()"
      [id]="id()"
      [hideLabel]="hideLabel()"
    ></bkd-subscription-detail-label>
    <input
      class="form-control"
      [id]="id()"
      [type]="fieldType()"
      [value]="value()"
      [disabled]="readonly()"
      (input)="onInput($event)"
    />
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubscriptionDetailTextfieldComponent {
  detail = model.required<SubscriptionDetail>();
  id = input.required<string>();
  hideLabel = input.required<boolean>();

  readonly = computed(() => this.detail().VssInternet === "R");
  required = computed(() => this.detail().VssInternet === "M");
  fieldType = computed(() =>
    this.detail().VssTypeId === SubscriptionDetailType.Int ? "number" : "text",
  );
  valueSignal = computed(() => signal(this.detail().Value));

  onInput(event: Event) {
    const target = event.target as HTMLInputElement;
    const value = this.valueSignal();
    value.set(target.value);
  }
}
