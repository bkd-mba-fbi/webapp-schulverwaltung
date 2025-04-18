import { Component } from "@angular/core";
import { TranslatePipe } from "@ngx-translate/core";
import { MySettingsNotificationsComponent } from "../my-settings-notifications/my-settings-notifications.component";

@Component({
  selector: "bkd-my-settings-show",
  templateUrl: "./my-settings-show.component.html",
  styleUrls: ["./my-settings-show.component.scss"],
  imports: [MySettingsNotificationsComponent, TranslatePipe],
})
export class MySettingsShowComponent {}
