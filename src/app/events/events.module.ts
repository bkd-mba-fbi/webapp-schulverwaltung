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
import { TestsAddComponent } from './components/tests-add/tests-add.component';
import { TestsAddHeaderComponent } from './components/tests-add-header/tests-add-header.component';
import { TestsAddEntryComponent } from './components/tests-add-entry/tests-add-entry.component';
import { TestTableHeaderComponent } from './components/test-table-header/test-table-header.component';
import { TestSummaryShortPipe } from './pipes/test-summary-short.pipe';

@NgModule({
  declarations: [
    TestsComponent,
    TestsListComponent,
    EventsComponent,
    EventsListComponent,
    TestsHeaderComponent,
    TestEditGradesComponent,
    TestsAddComponent,
    TestsAddHeaderComponent,
    TestsAddEntryComponent,
    GradeComponent,
    TestTableHeaderComponent,
    TestSummaryShortPipe,
  ],
  imports: [SharedModule, EventsRoutingModule],
})
export class EventsModule {}
