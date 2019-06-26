import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { PresenceControlRoutingModule } from './presence-control-routing.module';
import { PresenceControlComponent } from './components/presence-control/presence-control.component';
import { PresenceControlHeaderComponent } from './components/presence-control-header/presence-control-header.component';
import { PresenceControlListComponent } from './components/presence-control-list/presence-control-list.component';
import { PresenceControlCommentComponent } from './components/presence-control-comment/presence-control-comment.component';
import { PresenceControlDetailComponent } from './components/presence-control-detail/presence-control-detail.component';
import { PresenceControlEntryComponent } from './components/presence-control-entry/presence-control-entry.component';
import { PresenceControlBackComponent } from './components/presence-control-back/presence-control-back.component';

@NgModule({
  declarations: [
    PresenceControlComponent,
    PresenceControlHeaderComponent,
    PresenceControlListComponent,
    PresenceControlCommentComponent,
    PresenceControlDetailComponent,
    PresenceControlEntryComponent,
    PresenceControlBackComponent
  ],
  imports: [SharedModule, PresenceControlRoutingModule]
})
export class PresenceControlModule {}
