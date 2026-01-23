import { Route, Routes } from "@angular/router";
import { dossierRoute } from "../shared/components/student-dossier/dossier-route";
import { EventsComponent } from "./components/common/events/events.component";
import { EvaluationListComponent } from "./components/evaluation/evaluation-list/evaluation-list.component";
import { EvaluationStatisticComponent } from "./components/evaluation/evaluation-statistic/evaluation-statistic.component";
import { EvaluationComponent } from "./components/evaluation/evaluation/evaluation.component";
import { EventsStudentsListComponent } from "./components/students/events-students-list/events-students-list.component";
import { EventsStudentsStudyCourseDetailComponent } from "./components/students/events-students-study-course-detail/events-students-study-course-detail.component";
import { EventsStudentsComponent } from "./components/students/events-students/events-students.component";
import { StudyCoursesListComponent } from "./components/study-courses/study-courses-list/study-courses-list.component";
import { StudyCoursesComponent } from "./components/study-courses/study-courses/study-courses.component";
import { EventsTestsComponent } from "./components/tests/events-tests/events-tests.component";
import { TestsAddComponent } from "./components/tests/tests-add/tests-add.component";
import { TestsEditComponent } from "./components/tests/tests-edit/tests-edit.component";
import { TestsListComponent } from "./components/tests/tests-list/tests-list.component";
import { TestsComponent } from "./components/tests/tests/tests.component";
import { EventsCurrentListComponent } from "./current/events-current-list/events-current-list.component";

export const EVENTS_ROUTES: Routes = [
  {
    path: "study-courses",
    component: StudyCoursesComponent,
    children: [
      // /events/study-courses
      // → Events list "Aufnahmeverfahren"
      { path: "", component: StudyCoursesListComponent },

      // /events/study-courses/:id
      // → Event detail resp. students list
      getStudentsRoute(":id"),
    ],
  },
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
            component: EvaluationComponent,
            children: [
              {
                // /events/:id/evaluation
                // → Event detail with grades & abences
                path: "",
                component: EvaluationListComponent,
              },
              {
                // /events/:id/evaluation/statistic
                path: "statistic",
                component: EvaluationStatisticComponent,
              },
              dossierRoute,
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
