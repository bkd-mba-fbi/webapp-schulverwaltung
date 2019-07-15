import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home.component';

const routes: Routes = [
  {
    path: 'presence-control',
    loadChildren: () =>
      import('./presence-control/presence-control.module').then(
        m => m.PresenceControlModule
      )
  },
  {
    path: 'open-absences',
    loadChildren: () =>
      import('./open-absences/open-absences.module').then(
        m => m.OpenAbsencesModule
      )
  },
  {
    path: 'edit-absences',
    loadChildren: () =>
      import('./edit-absences/edit-absences.module').then(
        m => m.EditAbsencesModule
      )
  },
  {
    path: 'evaluate-absences',
    loadChildren: () =>
      import('./evaluate-absences/evaluate-absences.module').then(
        m => m.EvaluateAbsencesModule
      )
  },
  {
    path: '',
    component: HomeComponent,
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
