import {
  ChangeDetectionStrategy,
  Component,
  input,
  model,
} from "@angular/core";
import { TranslatePipe } from "@ngx-translate/core";
import { ResettableInputComponent } from "src/app/shared/components/resettable-input/resettable-input.component";

@Component({
  selector: "bkd-events-students-header",
  imports: [TranslatePipe, ResettableInputComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./events-students-header.component.html",
  styleUrl: "./events-students-header.component.scss",
})
export class EventsStudentsHeaderComponent {
  readonly title = input.required<Option<string>>();
  readonly count = input<Option<number>>(null);

  readonly searchTerm = model<string>();
}
