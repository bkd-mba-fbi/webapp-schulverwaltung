import { Component } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";
import { MySettingsNotificationsComponent } from "../my-settings-notifications/my-settings-notifications.component";

@Component({
  selector: "erz-my-settings-show",
  templateUrl: "./my-settings-show.component.html",
  styleUrls: ["./my-settings-show.component.scss"],
  standalone: true,
  imports: [MySettingsNotificationsComponent, TranslateModule],
})
export class MySettingsShowComponent {}
