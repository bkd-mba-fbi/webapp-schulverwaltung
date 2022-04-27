import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DossierComponent } from './components/dossier/dossier.component';

const routes: Routes = [
  {
    path: '',
    component: DossierComponent,
  },
];

@NgModule({ imports: [RouterModule.forChild(routes)], exports: [RouterModule] })
export class DossierRoutingModule {}
