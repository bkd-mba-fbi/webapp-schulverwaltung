import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditAbsencesComponent } from './edit-absences.component';

const routes: Routes = [
  {
    path: '',
    component: EditAbsencesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditAbsencesRoutingModule {}
