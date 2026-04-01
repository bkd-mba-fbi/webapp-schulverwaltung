import { Route } from "@angular/router";
import { ConfirmAbsencesComponent } from "../confirm-absences/confirm-absences.component";
import { StudentAbsencesComponent } from "./student-absences/student-absences.component";
import { StudentContactComponent } from "./student-contact/student-contact.component";
import { StudentDossierComponent } from "./student-dossier/student-dossier.component";
import { StudentGradesComponent } from "./student-grades/student-grades.component";
import { StudentComponent } from "./student/student.component";

export const studentRoute: Route = {
  path: "student/:id",
  children: [
    {
      path: "",
      get component() {
        // Avoid circular dependency caused by StudentComponent importing
        // STUDENT_PAGES and this file importing the component, while it is not
        // yet defined.
        return StudentComponent;
      },
      children: [
        {
          path: "contact",
          component: StudentContactComponent,
        },
        {
          path: "absences",
          component: StudentAbsencesComponent,
        },
        { path: "grades", component: StudentGradesComponent },
        { path: "dossier", component: StudentDossierComponent },
      ],
    },
    {
      path: "absences/confirm",
      component: ConfirmAbsencesComponent,
    },
  ],
};

export const STUDENT_PAGES = (
  (studentRoute.children ?? [])[0].children ?? []
).map(({ path }) => path);
