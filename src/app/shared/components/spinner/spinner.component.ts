import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "bkd-spinner",
  templateUrl: "./spinner.component.html",
  styleUrls: ["./spinner.component.scss"],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpinnerComponent {
  constructor() {}
}
