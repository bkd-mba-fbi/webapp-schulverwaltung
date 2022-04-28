import { Route } from '@angular/router';
import { ConfirmAbsencesComponent } from './components/confirm-absences/confirm-absences.component';
import { DossierAbsencesComponent } from './components/dossier-absences/dossier-absences.component';
import { DossierAddressesComponent } from './components/dossier-addresses/dossier-addresses.component';
import { DossierOverviewComponent } from './components/dossier-overview/dossier-overview.component';
import { StudentProfileComponent } from './components/student-profile/student-profile.component';

export const dossierRoute: Route = {
  path: 'student/:id',
  children: [
    {
      path: '',
      component: StudentProfileComponent,
      children: [
        { path: '', component: DossierOverviewComponent },
        { path: 'addresses', component: DossierAddressesComponent },
        { path: 'absences', component: DossierAbsencesComponent },
      ],
    },
    {
      path: 'confirm',
      component: ConfirmAbsencesComponent,
    },
  ],
};
