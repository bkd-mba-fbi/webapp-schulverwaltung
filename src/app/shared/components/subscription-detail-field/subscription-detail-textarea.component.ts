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
      [value]="value()"
      [disabled]="readonly()"
      (input)="onInput($event)"
      (blur)="onBlur()"
      bkdTextareaAutosize
    ></textarea>
  `,
  styleUrls: ["./subscription-detail-textarea.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubscriptionDetailTextareaComponent {
  detail = input.required<SubscriptionDetail>();
  id = input.required<string>();
  value = model<SubscriptionDetail["Value"]>();
  commit = output<SubscriptionDetail["Value"]>();

  readonly = computed(() => this.detail().VssInternet === "R");

  onInput(event: Event) {
    const { value } = event.target as HTMLTextAreaElement;
    this.value.set(value || null);
  }

  onBlur() {
    this.commit.emit(this.value() ?? null);
  }
}
