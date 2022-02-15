import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { EventsRoutingModule } from './events-routing.module';
import { EventsComponent } from './components/events/events.component';
import { TestsComponent } from './components/tests/tests.component';

@NgModule({
  declarations: [EventsComponent, TestsComponent],
  imports: [SharedModule, EventsRoutingModule],
})
export class EventsModule {}
