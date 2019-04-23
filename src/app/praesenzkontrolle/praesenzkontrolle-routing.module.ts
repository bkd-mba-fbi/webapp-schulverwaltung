import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PraesenzkontrolleComponent } from './praesenzkontrolle.component';

const routes: Routes = [
  {
    path: '',
    component: PraesenzkontrolleComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PraesenzkontrolleRoutingModule { }
