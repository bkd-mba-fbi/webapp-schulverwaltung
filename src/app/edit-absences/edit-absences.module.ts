import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { EditAbsencesRoutingModule } from './edit-absences-routing.module';
import { EditAbsencesComponent } from './components/edit-absences/edit-absences.component';
import { EditAbsencesHeaderComponent } from './components/edit-absences-header/edit-absences-header.component';
import { EditAbsencesListComponent } from './components/edit-absences-list/edit-absences-list.component';
import { EditAbsencesEditComponent } from './components/edit-absences-edit/edit-absences-edit.component';

@NgModule({
  declarations: [
    EditAbsencesComponent,
    EditAbsencesHeaderComponent,
    EditAbsencesListComponent,
    EditAbsencesEditComponent,
  ],
  imports: [SharedModule, EditAbsencesRoutingModule],
})
export class EditAbsencesModule {}
