import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { uniqueId } from "lodash-es";

@Component({
  selector: "erz-switch",
  templateUrl: "./switch.component.html",
  styleUrls: ["./switch.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [FormsModule],
})
export class SwitchComponent {
  @Input() id: Option<string> = null;
  @Input() label: Option<string> = null;
  @Input() disabled = false;
  @Input() value = false;
  @Output() valueChange = new EventEmitter<boolean>();

  fallbackId = uniqueId("erz-switch");

  constructor() {}
}
