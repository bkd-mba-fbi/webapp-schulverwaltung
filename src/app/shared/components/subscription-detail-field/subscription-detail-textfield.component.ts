import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  input,
  model,
  output,
  viewChild,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import {
  SubscriptionDetail,
  SubscriptionDetailType,
} from "src/app/shared/models/subscription.model";

@Component({
  selector: "bkd-subscription-detail-textfield",
  imports: [FormsModule],
  template: `
    <input
      #input
      class="form-control"
      [id]="id()"
      [type]="fieldType()"
      [disabled]="readonly()"
      [value]="detail().Value"
      [step]="isCurrency() ? '0.05' : '1'"
      (input)="onChange($event)"
      (blur)="onBlur()"
    />
  `,
  styles: `
    input[type="number"] {
      max-width: 15ch;
      min-width: 10ch;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubscriptionDetailTextfieldComponent {
  detail = model.required<SubscriptionDetail>();
  id = input.required<string>();
  commit = output<SubscriptionDetail>();

  readonly = computed(() => this.detail().VssInternet === "R");
  isInt = computed(
    () => this.detail().VssTypeId === SubscriptionDetailType.Int,
  );
  isCurrency = computed(
    () => this.detail().VssTypeId === SubscriptionDetailType.Currency,
  );
  fieldType = computed(() =>
    this.isInt() || this.isCurrency() ? "number" : "text",
  );

  private input = viewChild.required<ElementRef<HTMLInputElement>>("input");

  onChange(event: Event) {
    const { value: rawValue } = event.target as HTMLInputElement;
    const value = this.normalizeValueOnChange(rawValue);

    // For int fields, enforce the normalized value (i.e. no decimals or alpha
    // chars) as value of the input field (apparently, only with the [value]
    // binding, the normalized value is not applied).
    if (this.isInt()) {
      this.input().nativeElement.value = String(value);
    }

    this.updateDetailValue(value);
  }

  onBlur() {
    // Normalize the value such that the currency gets propperly formatted
    this.updateDetailValue(this.normalizeValueOnBlur(this.detail().Value));

    this.commit.emit(this.detail());
  }

  private normalizeValueOnChange(value: string): SubscriptionDetail["Value"] {
    if (value === "") {
      return null;
    }

    if (this.isInt()) {
      return Math.floor(Number(value));
    }

    return value;
  }

  private normalizeValueOnBlur(
    value: SubscriptionDetail["Value"],
  ): SubscriptionDetail["Value"] {
    if (value && this.isCurrency()) {
      return Number(this.detail().Value).toFixed(2);
    }

    return value;
  }

  private updateDetailValue(value: SubscriptionDetail["Value"]) {
    this.detail.set({
      ...this.detail(),
      Value: value,
    });
  }
}
