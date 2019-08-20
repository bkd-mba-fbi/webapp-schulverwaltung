import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EvaluateAbsencesComponent } from './components/evaluate-absences/evaluate-absences.component';

const routes: Routes = [
  {
    path: '',
    component: EvaluateAbsencesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EvaluateAbsencesRoutingModule {}
