import { Route } from '@angular/router';
import { ConfirmAbsencesComponent } from '../confirm-absences/confirm-absences.component';
import { StudentDossierComponent } from './student-dossier/student-dossier.component';
import { DossierAbsencesComponent } from './dossier-absences/dossier-absences.component';
import { DossierAddressesComponent } from './dossier-addresses/dossier-addresses.component';
import { DossierGradesComponent } from './dossier-grades/dossier-grades.component';

export const dossierRoute: Route = {
  path: 'student/:id',
  children: [
    {
      path: '',
      component: StudentDossierComponent,
      children: [
        { path: 'addresses', component: DossierAddressesComponent },
        { path: 'absences', component: DossierAbsencesComponent },
        { path: 'grades', component: DossierGradesComponent },
      ],
    },
    {
      path: 'absences/confirm',
      component: ConfirmAbsencesComponent,
    },
  ],
};
