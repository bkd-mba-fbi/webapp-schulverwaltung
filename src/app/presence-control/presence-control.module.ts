import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { PresenceControlRoutingModule } from './presence-control-routing.module';
import { PresenceControlComponent } from './presence-control.component';
import { PresenceControlHeaderComponent } from './presence-control-header/presence-control-header.component';
import { PresenceControlListComponent } from './presence-control-list/presence-control-list.component';
import { PresenceControlCommentComponent } from './presence-control-comment/presence-control-comment.component';
import { PresenceControlDetailComponent } from './presence-control-detail/presence-control-detail.component';
import { PresenceControlEntryComponent } from './presence-control-entry/presence-control-entry.component';

@NgModule({
  declarations: [
    PresenceControlComponent,
    PresenceControlHeaderComponent,
    PresenceControlListComponent,
    PresenceControlCommentComponent,
    PresenceControlDetailComponent,
    PresenceControlEntryComponent
  ],
  imports: [SharedModule, PresenceControlRoutingModule]
})
export class PresenceControlModule {}
