import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { EventsRoutingModule } from './events-routing.module';
import { CoursesComponent } from './components/courses/courses.component';
import { TestsComponent } from './components/tests/tests.component';
import { TestsListComponent } from './components/tests-list/tests-list.component';
import { CoursesListComponent } from './components/courses-list/courses-list.component';
import { TestsHeaderComponent } from './components/tests-header/tests-header.component';
import { TestEditGradesComponent } from './components/test-edit-grades/test-edit-grades.component';

@NgModule({
  declarations: [
    TestsComponent,
    TestsListComponent,
    CoursesComponent,
    CoursesListComponent,
    TestsHeaderComponent,
    TestEditGradesComponent,
  ],
  imports: [SharedModule, EventsRoutingModule],
})
export class EventsModule {}
