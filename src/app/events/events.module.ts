import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { EventsRoutingModule } from './events-routing.module';
import { EventsComponent } from './components/events/events.component';

@NgModule({
  declarations: [EventsComponent],
  imports: [SharedModule, EventsRoutingModule],
})
export class EventsModule {}
