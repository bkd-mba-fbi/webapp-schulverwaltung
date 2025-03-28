import { Route, Routes } from "@angular/router";
import { dossierRoute } from "../shared/components/student-dossier/dossier-route";
import { EventsCurrentListComponent } from "./components/events-current-list/events-current-list.component";
import { EventsStudentsListComponent } from "./components/events-students-list/events-students-list.component";
import { EventsStudentsStudyCourseDetailComponent } from "./components/events-students-study-course-detail/events-students-study-course-detail.component";
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
        path: "current",
        children: [
          // /events/current
          // → Events list "Aktuelle Fächer"
          { path: "", component: EventsCurrentListComponent },

          // /events/current/:id
          // → Event detail resp. students list
          getStudentsRoute(":id"),
        ],
      },

      {
        // /events
        // → Events list "Tests und Bewertung"
        path: "",
        component: EventsTestsComponent,
      },

      {
        path: ":id",
        component: TestsComponent,
        children: [
          {
            path: "tests",
            children: [
              {
                // /events/:id/tests
                // → Event detail with list of tests with grades/points
                path: "",
                component: TestsListComponent,
              },
              {
                path: ":testId/edit",
                component: TestsEditComponent,
              },
              {
                path: "add",
                component: TestsAddComponent,
              },
              dossierRoute,
            ],
          },

          {
            path: "evaluation",
            children: [
              // TODO:
              // {
              //   // /events/:id/evaluation
              //   // → Event detail with grades & abences
              //   path: "",
              //   component: EvaluationListComponent,
              // },
            ],
          },

          // /events/:id/students
          // → Event detail with list of students
          getStudentsRoute("students"),
        ],
      },
    ],
  },
];

export function getStudentsRoute(path: string): Route {
  return {
    path,
    component: EventsStudentsComponent,
    children: [
      { path: "", component: EventsStudentsListComponent },
      {
        path: "study-course-student/:id",
        component: EventsStudentsStudyCourseDetailComponent,
      },
      dossierRoute,
    ],
  };
}
