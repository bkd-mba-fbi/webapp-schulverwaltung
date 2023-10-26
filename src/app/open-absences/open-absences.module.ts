import { NgModule } from "@angular/core";

import { SharedModule } from "../shared/shared.module";
import { OpenAbsencesRoutingModule } from "./open-absences-routing.module";
import { OpenAbsencesComponent } from "./components/open-absences/open-absences.component";
import { OpenAbsencesListComponent } from "./components/open-absences-list/open-absences-list.component";
import { OpenAbsencesDetailComponent } from "./components/open-absences-detail/open-absences-detail.component";
import { ConfirmAbsencesSelectionService } from "../shared/services/confirm-absences-selection.service";

@NgModule({
  declarations: [
    OpenAbsencesComponent,
    OpenAbsencesListComponent,
    OpenAbsencesDetailComponent,
  ],
  providers: [ConfirmAbsencesSelectionService],
  imports: [SharedModule, OpenAbsencesRoutingModule],
})
export class OpenAbsencesModule {}
