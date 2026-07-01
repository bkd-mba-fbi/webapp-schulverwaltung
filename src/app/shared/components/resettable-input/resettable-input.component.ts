import {
  ChangeDetectionStrategy,
  Component,
  input,
  model,
} from "@angular/core";

@Component({
  selector: "bkd-resettable-input",
  templateUrl: "./resettable-input.component.html",
  styleUrls: ["./resettable-input.component.scss"],
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResettableInputComponent {
  readonly value = model<string>("");
  readonly disabled = input<boolean>(false);
  readonly placeholder = input<string>("");
  readonly label = input<string>("");
}
