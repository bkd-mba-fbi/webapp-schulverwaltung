import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { PresenceControlRoutingModule } from './presence-control-routing.module';
import { PresenceControlComponent } from './presence-control.component';
import { PresenceControlHeaderComponent } from './presence-control-header/presence-control-header.component';

@NgModule({
  declarations: [PresenceControlComponent, PresenceControlHeaderComponent],
  imports: [SharedModule, PresenceControlRoutingModule]
})
export class PresenceControlModule {}
