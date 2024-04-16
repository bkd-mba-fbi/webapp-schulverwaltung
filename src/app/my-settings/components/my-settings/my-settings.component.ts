import { ChangeDetectionStrategy, Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";

@Component({
  selector: "erz-my-settings",
  templateUrl: "./my-settings.component.html",
  styleUrls: ["./my-settings.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [RouterOutlet],
})
export class MySettingsComponent {
  constructor() {}
}
