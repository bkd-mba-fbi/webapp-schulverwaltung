import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EventsComponent } from './components/events/events.component';
import { TestsComponent } from './components/tests/tests.component';

const routes: Routes = [
  {
    path: '',
    component: EventsComponent,
  },
  {
    path: ':id/tests',
    component: TestsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EventsRoutingModule {}
