import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { EvaluateAbsencesRoutingModule } from './evaluate-absences-routing.module';
import { EvaluateAbsencesComponent } from './evaluate-absences.component';

@NgModule({
  declarations: [EvaluateAbsencesComponent],
  imports: [SharedModule, EvaluateAbsencesRoutingModule]
})
export class EvaluateAbsencesModule {}
