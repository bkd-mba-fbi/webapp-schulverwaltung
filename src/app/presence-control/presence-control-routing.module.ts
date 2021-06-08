import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PresenceControlComponent } from './components/presence-control/presence-control.component';
import { PresenceControlListComponent } from './components/presence-control-list/presence-control-list.component';
import { ConfirmAbsencesComponent } from '../shared/components/confirm-absences/confirm-absences.component';
import { StudentProfileComponent } from '../shared/components/student-profile/student-profile.component';
import { PresenceControlGroupComponent } from './components/presence-control-group/presence-control-group.component';

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
      {
        path: 'student/:id',
        children: [
          {
            path: '',
            component: StudentProfileComponent,
          },
          {
            path: 'confirm',
            component: ConfirmAbsencesComponent,
          },
        ],
      },
      {
        path: 'groups',
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
