import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OpenAbsencesComponent } from './open-absences.component';

const routes: Routes = [
  {
    path: '',
    component: OpenAbsencesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OpenAbsencesRoutingModule {}
