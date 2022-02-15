import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { EventsRoutingModule } from './events-routing.module';
import { CoursesComponent } from './components/courses/courses.component';
import { TestsComponent } from './components/tests/tests.component';
import { TestsListComponent } from './components/tests-list/tests-list.component';

@NgModule({
  declarations: [CoursesComponent, TestsComponent, TestsListComponent],
  imports: [SharedModule, EventsRoutingModule],
})
export class EventsModule {}
