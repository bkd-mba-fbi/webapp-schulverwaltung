import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { TranslatePipe } from "@ngx-translate/core";

@Component({
  selector: "bkd-my-profile-entry",
  templateUrl: "./my-profile-entry.component.html",
  styleUrls: ["./my-profile-entry.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslatePipe],
})
export class MyProfileEntryComponent {
  readonly label = input.required<string>();
  readonly value = input<Option<string | Date>>();

  constructor() {}
}
