import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { TranslatePipe } from "@ngx-translate/core";

@Component({
  selector: "bkd-my-profile-entry",
  templateUrl: "./my-profile-entry.component.html",
  styleUrls: ["./my-profile-entry.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslatePipe],
})
export class MyProfileEntryComponent {
  @Input() label: string;
  @Input() value: Option<string | Date>;

  constructor() {}
}
