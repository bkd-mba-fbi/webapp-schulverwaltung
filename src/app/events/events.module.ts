import { NgModule } from "@angular/core";
import { ConfirmAbsencesSelectionService } from "../shared/services/confirm-absences-selection.service";
import { SharedModule } from "../shared/shared.module";
import { EventsCurrentComponent } from "./components/events-current/events-current.component";
import { EventsListComponent } from "./components/events-list/events-list.component";
import { EventsTestsComponent } from "./components/events-tests/events-tests.component";
import { EventsComponent } from "./components/events/events.component";
import { GradeComponent } from "./components/grade/grade.component";
import { AverageGradesComponent } from "./components/grades/average-grades/average-grades.component";
import { GradeSelectComponent } from "./components/grades/grade-select/grade-select.component";
import { TestEditGradesComponent } from "./components/test-edit-grades/test-edit-grades.component";
import { TestTableHeaderComponent } from "./components/test-table-header/test-table-header.component";
import { TestsAddComponent } from "./components/tests-add/tests-add.component";
import { TestsEditFormComponent } from "./components/tests-edit-form/tests-edit-form.component";
import { TestsDeleteComponent } from "./components/tests-edit/tests-delete/tests-delete.component";
import { TestsEditComponent } from "./components/tests-edit/tests-edit.component";
import { TestsHeaderComponent } from "./components/tests-header/tests-header.component";
import { TestsListComponent } from "./components/tests-list/tests-list.component";
import { PublishTestComponent } from "./components/tests-publish/publish-test.component";
import { TestsComponent } from "./components/tests/tests.component";
import { EventsRoutingModule } from "./events-routing.module";
import { TestSummaryShortPipe } from "./pipes/test-summary-short.pipe";

@NgModule({
  declarations: [
    TestsComponent,
    TestsListComponent,
    EventsComponent,
    EventsListComponent,
    TestsHeaderComponent,
    TestEditGradesComponent,
    TestsAddComponent,
    GradeComponent,
    TestTableHeaderComponent,
    TestSummaryShortPipe,
    TestsEditComponent,
    TestsEditFormComponent,
    PublishTestComponent,
    TestsDeleteComponent,
    AverageGradesComponent,
    GradeSelectComponent,
    EventsTestsComponent,
    EventsCurrentComponent,
  ],
  providers: [ConfirmAbsencesSelectionService],
  imports: [SharedModule, EventsRoutingModule],
})
export class EventsModule {}
