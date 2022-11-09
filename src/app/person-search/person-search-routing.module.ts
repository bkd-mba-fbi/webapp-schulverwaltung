import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PersonSearchComponent } from './components/person-search/person-search.component';
import { dossierRoute } from '../shared/components/student-dossier/dossier-route';

const routes: Routes = [
  {
    path: '',
    component: PersonSearchComponent,
    children: [dossierRoute],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PersonSearchRoutingModule {}
