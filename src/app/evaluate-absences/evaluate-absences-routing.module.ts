import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EvaluateAbsencesComponent } from './components/evaluate-absences/evaluate-absences.component';
import { EvaluateAbsencesListComponent } from './components/evaluate-absences-list/evaluate-absences-list.component';
import { StudentDossierComponent } from '../shared/components/dossier/student-dossier/student-dossier.component';
import { ConfirmAbsencesComponent } from '../shared/components/confirm-absences/confirm-absences.component';

const routes: Routes = [
  {
    path: '',
    component: EvaluateAbsencesComponent,
    children: [
      {
        path: '',
        component: EvaluateAbsencesListComponent,
        data: {
          restoreScrollPositionFrom: ['/evaluate-absences/student/:id'],
        },
      },
      {
        path: 'student/:id',
        children: [
          {
            path: '',
            component: StudentDossierComponent,
          },
          {
            path: 'confirm',
            component: ConfirmAbsencesComponent,
          },
        ],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EvaluateAbsencesRoutingModule {}
