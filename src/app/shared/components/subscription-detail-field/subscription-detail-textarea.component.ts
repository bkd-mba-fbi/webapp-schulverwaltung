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
  readonly detail = input.required<SubscriptionDetail>();
  readonly id = input.required<string>();
  readonly value = model<SubscriptionDetail["Value"]>();
  readonly commit = output<SubscriptionDetail["Value"]>();

  protected readonly readonly = computed(
    () => this.detail().VssInternet === "R",
  );

  protected onInput(event: Event) {
    const { value } = event.target as HTMLTextAreaElement;
    this.value.set(value || null);
  }

  protected onBlur() {
    this.commit.emit(this.value() ?? null);
  }
}
