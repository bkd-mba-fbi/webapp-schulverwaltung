import {
  ChangeDetectionStrategy,
  Component,
  input,
  model,
  output,
} from "@angular/core";
import { TextareaAutosizeDirective } from "../../directives/textarea-autosize.directive";

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
  styles: `
    :host {
      display: block;
    }

    textarea {
      min-width: 30ch;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GradingItemCommentTextareaComponent {
  value = model<string | null>(null);
  disabled = input<boolean>(false);
  commit = output<string | null>();

  onInput(event: Event) {
    const { value } = event.target as HTMLTextAreaElement;
    this.value.set(value || null);
  }

  onBlur() {
    this.commit.emit(this.value() ?? null);
  }
}
