import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PresenceControlComponent } from './components/presence-control/presence-control.component';
import { PresenceControlListComponent } from './components/presence-control-list/presence-control-list.component';
import { PresenceControlDetailComponent } from './components/presence-control-detail/presence-control-detail.component';
import { PresenceControlCommentComponent } from './components/presence-control-comment/presence-control-comment.component';

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
            '/presence-control/detail/:id',
            '/presence-control/comment/:studentId/:lessonId',
          ],
        },
      },
      {
        path: 'detail/:id',
        component: PresenceControlDetailComponent,
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
