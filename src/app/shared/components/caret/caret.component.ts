import { ChangeDetectionStrategy, Component, Input } from "@angular/core";

@Component({
  selector: "bkd-caret",
  templateUrl: "./caret.component.html",
  styleUrls: ["./caret.component.scss"],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CaretComponent {
  @Input() expanded: boolean = false;
}
