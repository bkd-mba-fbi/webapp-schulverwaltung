import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PersonSearchComponent } from './components/person-search/person-search.component';

const routes: Routes = [
  {
    path: '',
    component: PersonSearchComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PersonSearchRoutingModule {}
