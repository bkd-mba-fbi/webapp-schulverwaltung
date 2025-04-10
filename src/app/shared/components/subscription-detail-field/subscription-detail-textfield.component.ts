import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  model,
  output,
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
    <bkd-subscription-detail-label
      [detail]="detail()"
      [id]="id()"
      [hideLabel]="hideLabel()"
    ></bkd-subscription-detail-label>
    <input
      class="form-control"
      [id]="id()"
      [type]="fieldType()"
      [value]="detail().Value"
      [disabled]="readonly()"
      (input)="onInput($event)"
      (blur)="onBlur()"
    />
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubscriptionDetailTextfieldComponent {
  detail = model.required<SubscriptionDetail>();
  id = input.required<string>();
  hideLabel = input.required<boolean>();
  commit = output<SubscriptionDetail>();

  readonly = computed(() => this.detail().VssInternet === "R");
  required = computed(() => this.detail().VssInternet === "M");
  fieldType = computed(() =>
    this.detail().VssTypeId === SubscriptionDetailType.Int ? "number" : "text",
  );

  onInput(event: Event) {
    const { value } = event.target as HTMLInputElement;
    this.detail.set({
      ...this.detail(),
      Value: this.fieldType() === "number" ? Number(value) : value,
    });
  }

  onBlur() {
    this.commit.emit(this.detail());
  }
}
