import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PresenceControlComponent } from './presence-control.component';

const routes: Routes = [
  {
    path: '',
    component: PresenceControlComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PresenceControlRoutingModule {}
