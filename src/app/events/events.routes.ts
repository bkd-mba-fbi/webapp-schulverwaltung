import { Routes } from "@angular/router";
import { dossierRoute } from "../shared/components/student-dossier/dossier-route";
import { EventsCurrentComponent } from "./components/events-current/events-current.component";
import { EventsStudentsListComponent } from "./components/events-students-list/events-students-list.component";
import { EventsStudentsComponent } from "./components/events-students/events-students.component";
import { EventsTestsComponent } from "./components/events-tests/events-tests.component";
import { EventsComponent } from "./components/events/events.component";
import { TestsAddComponent } from "./components/tests-add/tests-add.component";
import { TestsEditComponent } from "./components/tests-edit/tests-edit.component";
import { TestsListComponent } from "./components/tests-list/tests-list.component";
import { TestsComponent } from "./components/tests/tests.component";

export const EVENTS_ROUTES: Routes = [
  {
    path: "",
    component: EventsComponent,
    children: [
      {
        path: "",
        component: EventsTestsComponent,
      },
      {
        path: "current",
        component: EventsCurrentComponent,
      },
      {
        path: "students/:id",
        component: EventsStudentsComponent,
        children: [
          { path: "", component: EventsStudentsListComponent },
          dossierRoute,
        ],
      },
      {
        path: ":id",
        component: TestsComponent,
        children: [
          {
            path: "tests",
            component: TestsListComponent,
          },
        ],
      },
      {
        path: ":id/tests/:testId/edit",
        component: TestsComponent,
        children: [{ path: "", component: TestsEditComponent }],
      },
      {
        path: ":id/tests/add",
        component: TestsComponent,
        children: [{ path: "", component: TestsAddComponent }],
      },
      { path: ":id/tests", children: [dossierRoute] },
    ],
  },
];
