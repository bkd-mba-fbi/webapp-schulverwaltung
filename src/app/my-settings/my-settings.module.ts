import { NgModule } from "@angular/core";
import { SharedModule } from "../shared/shared.module";

import { MySettingsRoutingModule } from "./my-settings-routing.module";
import { MySettingsComponent } from "./components/my-settings/my-settings.component";
import { MySettingsShowComponent } from "./components/my-settings-show/my-settings-show.component";
import { MySettingsNotificationsComponent } from "./components/my-settings-notifications/my-settings-notifications.component";
import { MySettingsNotificationsToggleComponent } from "./components/my-settings-notifications-toggle/my-settings-notifications-toggle.component";

@NgModule({
  declarations: [
    MySettingsComponent,
    MySettingsShowComponent,
    MySettingsNotificationsComponent,
    MySettingsNotificationsToggleComponent,
  ],
  providers: [],
  imports: [SharedModule, MySettingsRoutingModule],
})
export class MySettingsModule {}
