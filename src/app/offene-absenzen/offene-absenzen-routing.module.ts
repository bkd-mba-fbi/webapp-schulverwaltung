import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OffeneAbsenzenComponent } from './offene-absenzen.component';

const routes: Routes = [
  {
    path: '',
    component: OffeneAbsenzenComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OffeneAbsenzenRoutingModule {}
