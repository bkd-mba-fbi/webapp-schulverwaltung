import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { PresenceControlRoutingModule } from './presence-control-routing.module';
import { PresenceControlComponent } from './components/presence-control/presence-control.component';
import { PresenceControlHeaderComponent } from './components/presence-control-header/presence-control-header.component';
import { PresenceControlListComponent } from './components/presence-control-list/presence-control-list.component';
import { PresenceControlEntryComponent } from './components/presence-control-entry/presence-control-entry.component';
import { PresenceControlBlockLessonComponent } from './components/presence-control-block-lesson/presence-control-block-lesson.component';
import { PresenceControlIncidentComponent } from './components/presence-control-incident/presence-control-incident.component';

@NgModule({
  declarations: [
    PresenceControlComponent,
    PresenceControlHeaderComponent,
    PresenceControlListComponent,
    PresenceControlEntryComponent,
    PresenceControlBlockLessonComponent,
    PresenceControlIncidentComponent,
  ],
  imports: [SharedModule, PresenceControlRoutingModule],
  entryComponents: [PresenceControlBlockLessonComponent],
})
export class PresenceControlModule {}
