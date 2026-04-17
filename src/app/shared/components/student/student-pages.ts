import { Route } from "@angular/router";
import { StudentAbsencesComponent } from "./student-absences/student-absences.component";
import { StudentContactComponent } from "./student-contact/student-contact.component";
import { StudentDossierComponent } from "./student-dossier/student-dossier.component";
import { StudentGradesComponent } from "./student-grades/student-grades.component";

// Defined the student child routes here (rather than in student-route.ts) to
// avoid a circular dependency.
export const studentPageRoutes: ReadonlyArray<Route> = [
  { path: "contact", component: StudentContactComponent },
  { path: "absences", component: StudentAbsencesComponent },
  { path: "grades", component: StudentGradesComponent },
  { path: "dossier", component: StudentDossierComponent },
];

export const STUDENT_PAGES = studentPageRoutes.map(({ path }) => path!);
