import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { EventsRoutingModule } from './events-routing.module';
import { EventsComponent } from './components/events/events.component';
import { TestsComponent } from './components/tests/tests.component';
import { TestsListComponent } from './tests/tests-list/tests-list.component';

@NgModule({
  declarations: [EventsComponent, TestsComponent, TestsListComponent],
  imports: [SharedModule, EventsRoutingModule],
})
export class EventsModule {}
