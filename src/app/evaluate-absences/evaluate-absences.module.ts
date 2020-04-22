import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { EvaluateAbsencesRoutingModule } from './evaluate-absences-routing.module';
import { EvaluateAbsencesComponent } from './components/evaluate-absences/evaluate-absences.component';
import { EvaluateAbsencesHeaderComponent } from './components/evaluate-absences-header/evaluate-absences-header.component';
import { EvaluateAbsencesListComponent } from './components/evaluate-absences-list/evaluate-absences-list.component';
import { STUDENT_PROFILE_BACKLINK } from '../shared/tokens/student-profile-backlink';

@NgModule({
  declarations: [
    EvaluateAbsencesComponent,
    EvaluateAbsencesHeaderComponent,
    EvaluateAbsencesListComponent,
  ],
  providers: [
    { provide: STUDENT_PROFILE_BACKLINK, useValue: '/evaluate-absences' },
  ],
  imports: [SharedModule, EvaluateAbsencesRoutingModule],
})
export class EvaluateAbsencesModule {}
