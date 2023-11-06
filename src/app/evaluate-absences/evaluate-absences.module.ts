import { NgModule } from "@angular/core";
import { ConfirmAbsencesSelectionService } from "../shared/services/confirm-absences-selection.service";
import { SharedModule } from "../shared/shared.module";
import { EvaluateAbsencesHeaderComponent } from "./components/evaluate-absences-header/evaluate-absences-header.component";
import { EvaluateAbsencesListComponent } from "./components/evaluate-absences-list/evaluate-absences-list.component";
import { EvaluateAbsencesComponent } from "./components/evaluate-absences/evaluate-absences.component";
import { EvaluateAbsencesRoutingModule } from "./evaluate-absences-routing.module";

@NgModule({
  declarations: [
    EvaluateAbsencesComponent,
    EvaluateAbsencesHeaderComponent,
    EvaluateAbsencesListComponent,
  ],
  providers: [ConfirmAbsencesSelectionService],
  imports: [SharedModule, EvaluateAbsencesRoutingModule],
})
export class EvaluateAbsencesModule {}
