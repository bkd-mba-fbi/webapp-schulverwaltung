import {
  ChangeDetectionStrategy,
  Component,
  input,
  model,
  output,
} from "@angular/core";
import { TextareaAutosizeDirective } from "../../directives/textarea-autosize.directive";
import { Option } from "../../models/common-types";

@Component({
  selector: "bkd-grading-item-comment-textarea",
  imports: [TextareaAutosizeDirective],
  template: `
    <textarea
      class="form-control"
      bkdTextareaAutosize
      [value]="value() || ''"
      (input)="onInput($event)"
      (blur)="onBlur()"
      [disabled]="disabled()"
    ></textarea>
  `,
  styleUrls: ["./grading-item-comment-textarea.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GradingItemCommentTextareaComponent {
  value = model<Option<string>>(null);
  disabled = input<boolean>(false);
  commit = output<Option<string>>();

  onInput(event: Event) {
    const { value } = event.target as HTMLTextAreaElement;
    this.value.set(value || null);
  }

  onBlur() {
    this.commit.emit(this.value() ?? null);
  }
}
