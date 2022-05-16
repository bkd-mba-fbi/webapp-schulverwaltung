import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EventsComponent } from './components/events/events.component';
import { TestsComponent } from './components/tests/tests.component';
import { TestsListComponent } from './components/tests-list/tests-list.component';
import { EventsListComponent } from './components/events-list/events-list.component';
import { TestsEditComponent } from './components/tests-edit/tests-edit.component';
import { TestsAddComponent } from './components/tests-add/tests-add.component';
import { dossierRoute } from '../shared/components/student-dossier/dossier-route';

const routes: Routes = [
  {
    path: '',
    component: EventsComponent,
    children: [
      {
        path: '',
        component: EventsListComponent,
      },
      {
        path: ':id',
        component: TestsComponent,
        children: [
          {
            path: 'tests',
            component: TestsListComponent,
          },
        ],
      },
      {
        path: ':id/tests/:testId/edit',
        component: TestsComponent,
        children: [{ path: '', component: TestsEditComponent }],
      },
      {
        path: ':id/tests/add',
        component: TestsComponent,
        children: [{ path: '', component: TestsAddComponent }],
      },
      { path: ':id/tests', children: [dossierRoute] },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EventsRoutingModule {}
