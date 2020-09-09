import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { PresenceControlRoutingModule } from './presence-control-routing.module';
import { PresenceControlComponent } from './components/presence-control/presence-control.component';
import { PresenceControlHeaderComponent } from './components/presence-control-header/presence-control-header.component';
import { PresenceControlListComponent } from './components/presence-control-list/presence-control-list.component';
import { PresenceControlCommentComponent } from './components/presence-control-comment/presence-control-comment.component';
import { PresenceControlEntryComponent } from './components/presence-control-entry/presence-control-entry.component';
import { PresenceControlDialogComponent } from './components/presence-control-dialog/presence-control-dialog.component';
import { STUDENT_PROFILE_BACKLINK } from '../shared/tokens/student-profile-backlink';
import { PresenceControlIncidentComponent } from './components/presence-control-incident/presence-control-incident.component';

@NgModule({
  declarations: [
    PresenceControlComponent,
    PresenceControlHeaderComponent,
    PresenceControlListComponent,
    PresenceControlCommentComponent,
    PresenceControlEntryComponent,
    PresenceControlDialogComponent,
    PresenceControlIncidentComponent,
  ],
  providers: [
    { provide: STUDENT_PROFILE_BACKLINK, useValue: '/presence-control' },
  ],
  imports: [SharedModule, PresenceControlRoutingModule],
  entryComponents: [PresenceControlDialogComponent],
})
export class PresenceControlModule {}
