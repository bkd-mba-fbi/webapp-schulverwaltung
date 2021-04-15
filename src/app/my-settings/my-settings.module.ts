import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

import { MySettingsRoutingModule } from './my-settings-routing.module';
import { MySettingsComponent } from './components/my-settings/my-settings.component';
import { MySettingsShowComponent } from './components/my-settings-show/my-settings-show.component';
import { MySettingsNotificationsComponent } from './components/my-settings-notifications/my-settings-notifications.component';

@NgModule({
  declarations: [
    MySettingsComponent,
    MySettingsShowComponent,
    MySettingsNotificationsComponent,
  ],
  providers: [],
  imports: [SharedModule, MySettingsRoutingModule],
})
export class MySettingsModule {}
