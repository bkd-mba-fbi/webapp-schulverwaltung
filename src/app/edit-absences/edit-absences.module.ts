import { NgModule } from "@angular/core";
import { ConfirmAbsencesSelectionService } from "../shared/services/confirm-absences-selection.service";
import { SharedModule } from "../shared/shared.module";
import { EditAbsencesEditComponent } from "./components/edit-absences-edit/edit-absences-edit.component";
import { EditAbsencesHeaderComponent } from "./components/edit-absences-header/edit-absences-header.component";
import { EditAbsencesListComponent } from "./components/edit-absences-list/edit-absences-list.component";
import { EditAbsencesComponent } from "./components/edit-absences/edit-absences.component";
import { EditAbsencesRoutingModule } from "./edit-absences-routing.module";

@NgModule({
  declarations: [
    EditAbsencesComponent,
    EditAbsencesHeaderComponent,
    EditAbsencesListComponent,
    EditAbsencesEditComponent,
  ],
  providers: [ConfirmAbsencesSelectionService],
  imports: [SharedModule, EditAbsencesRoutingModule],
})
export class EditAbsencesModule {}
