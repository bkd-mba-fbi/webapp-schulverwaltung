import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AbsenzenAuswertenComponent } from './absenzen-auswerten.component';

const routes: Routes = [
  {
    path: '',
    component: AbsenzenAuswertenComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AbsenzenAuswertenRoutingModule { }
