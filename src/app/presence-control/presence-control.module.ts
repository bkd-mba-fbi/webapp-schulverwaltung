import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { PresenceControlRoutingModule } from './presence-control-routing.module';
import { PresenceControlComponent } from './presence-control.component';

@NgModule({
  declarations: [PresenceControlComponent],
  imports: [SharedModule, PresenceControlRoutingModule]
})
export class PresenceControlModule {}
