import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  model,
  output,
  signal,
} from "@angular/core";
import { SubscriptionDetail } from "src/app/shared/models/subscription.model";
import { SubscriptionDetailLabelComponent } from "./subscription-detail-label.component";

@Component({
  selector: "bkd-subscription-detail-textarea",
  imports: [SubscriptionDetailLabelComponent],
  template: `
    <bkd-subscription-detail-label
      [detail]="detail()"
      [id]="id()"
      [hideLabel]="hideLabel()"
    ></bkd-subscription-detail-label>
    <textarea
      class="form-control"
      [id]="id()"
      [value]="detail().Value"
      [disabled]="readonly()"
      (input)="onInput($event)"
      (blur)="onBlur()"
    ></textarea>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubscriptionDetailTextareaComponent {
  detail = model.required<SubscriptionDetail>();
  id = input.required<string>();
  hideLabel = input.required<boolean>();
  commit = output<SubscriptionDetail>();

  readonly = computed(() => this.detail().VssInternet === "R");
  required = computed(() => this.detail().VssInternet === "M");
  valueSignal = computed(() => signal(this.detail().Value));

  onInput(event: Event) {
    const { value } = event.target as HTMLTextAreaElement;
    this.detail.set({ ...this.detail(), Value: value });
  }

  onBlur() {
    this.commit.emit(this.detail());
  }
}
