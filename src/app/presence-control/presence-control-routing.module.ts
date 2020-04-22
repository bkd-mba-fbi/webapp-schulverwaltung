import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PresenceControlComponent } from './components/presence-control/presence-control.component';
import { PresenceControlListComponent } from './components/presence-control-list/presence-control-list.component';
import { PresenceControlCommentComponent } from './components/presence-control-comment/presence-control-comment.component';
import { StudentProfileComponent } from '../shared/components/student-profile/student-profile.component';

const routes: Routes = [
  {
    path: '',
    component: PresenceControlComponent,
    children: [
      {
        path: '',
        component: PresenceControlListComponent,
        data: {
          restoreScrollPositionFrom: [
            '/presence-control/student/:id',
            '/presence-control/comment/:studentId/:lessonId',
          ],
        },
      },
      {
        path: 'student/:id',
        component: StudentProfileComponent,
      },
      {
        path: 'comment/:studentId/:lessonId',
        component: PresenceControlCommentComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PresenceControlRoutingModule {}
