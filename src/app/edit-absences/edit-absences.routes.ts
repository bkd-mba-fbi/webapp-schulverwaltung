import { Routes } from "@angular/router";
import { STUDENT_PAGES } from "../shared/components/student/student-pages";
import { studentRoute } from "../shared/components/student/student-route";
import { EditAbsencesEditComponent } from "./components/edit-absences-edit/edit-absences-edit.component";
import { EditAbsencesListComponent } from "./components/edit-absences-list/edit-absences-list.component";
import { EditAbsencesComponent } from "./components/edit-absences/edit-absences.component";

export const EDIT_ABSENCES_ROUTES: Routes = [
  {
    path: "",
    component: EditAbsencesComponent,
    children: [
      {
        path: "",
        component: EditAbsencesListComponent,
        data: {
          restoreScrollPositionFrom: [
            "/edit-absences/edit",
            ...STUDENT_PAGES.map(
              (page) => `/edit-absences/student/:id/${page}`,
            ),
          ],
        },
      },
      {
        path: "edit",
        component: EditAbsencesEditComponent,
      },
      studentRoute,
    ],
  },
];
