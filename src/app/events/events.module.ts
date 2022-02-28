import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { EventsRoutingModule } from './events-routing.module';
import { EventsComponent } from './components/events/events.component';
import { TestsComponent } from './components/tests/tests.component';
import { TestsListComponent } from './components/tests-list/tests-list.component';
import { EventsListComponent } from './components/events-list/events-list.component';
import { TestsHeaderComponent } from './components/tests-header/tests-header.component';
import { TestEditGradesComponent } from './components/test-edit-grades/test-edit-grades.component';
import { GradeComponent } from './components/grade/grade.component';

@NgModule({
  declarations: [
    TestsComponent,
    TestsListComponent,
    EventsComponent,
    EventsListComponent,
    TestsHeaderComponent,
    TestEditGradesComponent,
    GradeComponent,
  ],
  imports: [SharedModule, EventsRoutingModule],
})
export class EventsModule {}
