import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditAbsencesComponent } from './components/edit-absences/edit-absences.component';
import { EditAbsencesListComponent } from './components/edit-absences-list/edit-absences-list.component';
import { EditAbsencesEditComponent } from './components/edit-absences-edit/edit-absences-edit.component';
import { StudentDossierComponent } from '../shared/components/dossier/student-dossier/student-dossier.component';
import { ConfirmAbsencesComponent } from '../shared/components/confirm-absences/confirm-absences.component';

const routes: Routes = [
  {
    path: '',
    component: EditAbsencesComponent,
    children: [
      {
        path: '',
        component: EditAbsencesListComponent,
        data: {
          restoreScrollPositionFrom: [
            '/edit-absences/edit',
            '/edit-absences/student/:id',
          ],
        },
      },
      {
        path: 'edit',
        component: EditAbsencesEditComponent,
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
export class EditAbsencesRoutingModule {}
