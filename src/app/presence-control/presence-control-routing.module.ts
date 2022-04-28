import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { dossierRoute } from '../shared/dossier-route';
import { PresenceControlGroupComponent } from './components/presence-control-group/presence-control-group.component';
import { PresenceControlListComponent } from './components/presence-control-list/presence-control-list.component';
import { PresenceControlComponent } from './components/presence-control/presence-control.component';

const routes: Routes = [
  {
    path: '',
    component: PresenceControlComponent,
    children: [
      {
        path: '',
        component: PresenceControlListComponent,
        data: {
          restoreScrollPositionFrom: ['/presence-control/student/:id'],
        },
      },
      dossierRoute,
      {
        path: 'groups/:id',
        component: PresenceControlGroupComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PresenceControlRoutingModule {}
