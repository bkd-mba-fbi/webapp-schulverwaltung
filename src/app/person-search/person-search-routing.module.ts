import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PersonSearchComponent } from './components/person-search/person-search.component';
import { PersonSearchHeaderComponent } from './components/person-search-header/person-search-header.component';
import { dossierRoute } from '../shared/components/student-dossier/dossier-route';

const routes: Routes = [
  {
    path: '',
    component: PersonSearchComponent,
    children: [
      {
        path: '',
        component: PersonSearchHeaderComponent,
      },
      dossierRoute,
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PersonSearchRoutingModule {}
