import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  model,
  output,
} from "@angular/core";
import { SubscriptionDetail } from "src/app/shared/models/subscription.model";
import { TextareaAutosizeDirective } from "../../directives/textarea-autosize.directive";

@Component({
  selector: "bkd-subscription-detail-textarea",
  imports: [TextareaAutosizeDirective],
  template: `
    <textarea
      class="form-control"
      [id]="id()"
      [value]="detail().Value"
      [disabled]="readonly()"
      (input)="onInput($event)"
      (blur)="onBlur()"
      bkdTextareaAutosize
    ></textarea>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubscriptionDetailTextareaComponent {
  detail = model.required<SubscriptionDetail>();
  id = input.required<string>();
  commit = output<SubscriptionDetail>();

  readonly = computed(() => this.detail().VssInternet === "R");

  onInput(event: Event) {
    const { value } = event.target as HTMLTextAreaElement;
    this.detail.set({ ...this.detail(), Value: value || null });
  }

  onBlur() {
    this.commit.emit(this.detail());
  }
}
