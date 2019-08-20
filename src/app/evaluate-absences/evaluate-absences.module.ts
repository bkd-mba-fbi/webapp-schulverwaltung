import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { EvaluateAbsencesRoutingModule } from './evaluate-absences-routing.module';
import { EvaluateAbsencesComponent } from './components/evaluate-absences/evaluate-absences.component';
import { EvaluateAbsencesHeaderComponent } from './components/evaluate-absences-header/evaluate-absences-header.component';
import { EvaluateAbsencesListComponent } from './components/evaluate-absences-list/evaluate-absences-list.component';

@NgModule({
  declarations: [
    EvaluateAbsencesComponent,
    EvaluateAbsencesHeaderComponent,
    EvaluateAbsencesListComponent
  ],
  imports: [SharedModule, EvaluateAbsencesRoutingModule]
})
export class EvaluateAbsencesModule {}
