import { ChangeDetectionStrategy, Component, input } from "@angular/core";

@Component({
  selector: "bkd-caret",
  templateUrl: "./caret.component.html",
  styleUrls: ["./caret.component.scss"],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CaretComponent {
  readonly expanded = input(false);
}
