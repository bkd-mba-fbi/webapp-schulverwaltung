import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AbsenzenBearbeitenComponent } from './absenzen-bearbeiten.component';

const routes: Routes = [
  {
    path: '',
    component: AbsenzenBearbeitenComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AbsenzenBearbeitenRoutingModule { }
