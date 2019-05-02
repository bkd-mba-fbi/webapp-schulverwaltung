import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { EditAbsencesRoutingModule } from './edit-absences-routing.module';
import { EditAbsencesComponent } from './edit-absences.component';

@NgModule({
  declarations: [EditAbsencesComponent],
  imports: [SharedModule, EditAbsencesRoutingModule]
})
export class EditAbsencesModule {}
