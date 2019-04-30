import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { OpenAbsencesRoutingModule } from './open-absences-routing.module';
import { OpenAbsencesComponent } from './open-absences.component';

@NgModule({
  declarations: [OpenAbsencesComponent],
  imports: [SharedModule, OpenAbsencesRoutingModule]
})
export class OpenAbsencesModule {}
