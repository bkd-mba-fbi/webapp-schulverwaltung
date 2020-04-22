import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { EditAbsencesRoutingModule } from './edit-absences-routing.module';
import { EditAbsencesComponent } from './components/edit-absences/edit-absences.component';
import { EditAbsencesHeaderComponent } from './components/edit-absences-header/edit-absences-header.component';
import { EditAbsencesListComponent } from './components/edit-absences-list/edit-absences-list.component';
import { EditAbsencesEditComponent } from './components/edit-absences-edit/edit-absences-edit.component';
import { STUDENT_PROFILE_BACKLINK } from '../shared/tokens/student-profile-backlink';

@NgModule({
  declarations: [
    EditAbsencesComponent,
    EditAbsencesHeaderComponent,
    EditAbsencesListComponent,
    EditAbsencesEditComponent,
  ],
  providers: [
    { provide: STUDENT_PROFILE_BACKLINK, useValue: '/edit-absences' },
  ],
  imports: [SharedModule, EditAbsencesRoutingModule],
})
export class EditAbsencesModule {}
