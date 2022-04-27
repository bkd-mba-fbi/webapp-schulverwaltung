import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DossierOverviewComponent } from './components/dossier-overview/dossier-overview.component';
import { DossierComponent } from './components/dossier/dossier.component';

const routes: Routes = [
  {
    path: '',
    component: DossierComponent,
    children: [
      {
        path: '',
        component: DossierOverviewComponent,
      },
    ],
  },
];

@NgModule({ imports: [RouterModule.forChild(routes)], exports: [RouterModule] })
export class DossierRoutingModule {}
