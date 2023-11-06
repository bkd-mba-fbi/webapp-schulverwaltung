import { NgModule } from "@angular/core";
import { ConfirmAbsencesSelectionService } from "../shared/services/confirm-absences-selection.service";
import { SharedModule } from "../shared/shared.module";
import { PresenceControlBlockLessonComponent } from "./components/presence-control-block-lesson/presence-control-block-lesson.component";
import { PresenceControlEntryComponent } from "./components/presence-control-entry/presence-control-entry.component";
import { PresenceControlGroupDialogComponent } from "./components/presence-control-group-dialog/presence-control-group-dialog.component";
import { PresenceControlGroupComponent } from "./components/presence-control-group/presence-control-group.component";
import { PresenceControlHeaderComponent } from "./components/presence-control-header/presence-control-header.component";
import { PresenceControlIncidentComponent } from "./components/presence-control-incident/presence-control-incident.component";
import { PresenceControlListComponent } from "./components/presence-control-list/presence-control-list.component";
import { PresenceControlPrecedingAbsenceComponent } from "./components/presence-control-preceding-absence/presence-control-preceding-absence.component";
import { PresenceControlComponent } from "./components/presence-control/presence-control.component";
import { PresenceControlRoutingModule } from "./presence-control-routing.module";

@NgModule({
  declarations: [
    PresenceControlComponent,
    PresenceControlHeaderComponent,
    PresenceControlListComponent,
    PresenceControlEntryComponent,
    PresenceControlBlockLessonComponent,
    PresenceControlIncidentComponent,
    PresenceControlPrecedingAbsenceComponent,
    PresenceControlGroupComponent,
    PresenceControlGroupDialogComponent,
  ],
  providers: [ConfirmAbsencesSelectionService],
  imports: [SharedModule, PresenceControlRoutingModule],
})
export class PresenceControlModule {}
