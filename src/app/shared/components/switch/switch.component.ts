import {
  ChangeDetectionStrategy,
  Component,
  input,
  model,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { uniqueId } from "lodash-es";

@Component({
  selector: "bkd-switch",
  templateUrl: "./switch.component.html",
  styleUrls: ["./switch.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule],
})
export class SwitchComponent {
  readonly id = input<Option<string>>(null);
  readonly label = input<Option<string>>(null);
  readonly disabled = input(false);
  readonly value = model(false);

  fallbackId = uniqueId("bkd-switch");

  constructor() {}
}
