import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";

@Component({
  selector: "erz-my-profile-entry",
  templateUrl: "./my-profile-entry.component.html",
  styleUrls: ["./my-profile-entry.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [TranslateModule],
})
export class MyProfileEntryComponent {
  @Input() label: string;
  @Input() value: Option<string | Date>;

  constructor() {}
}
