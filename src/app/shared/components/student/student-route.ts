import { Route } from "@angular/router";
import { StudentStateService } from "../../services/student-state.service";
import { ConfirmAbsencesComponent } from "../confirm-absences/confirm-absences.component";
import { StudentDossierEditComponent } from "./student-dossier-edit/student-dossier-edit.component";
import { studentPageRoutes } from "./student-pages";
import { StudentComponent } from "./student/student.component";

export const studentRoute: Route = {
  path: "student/:id",
  providers: [StudentStateService],
  children: [
    {
      path: "",
      component: StudentComponent,
      children: [...studentPageRoutes],
    },
    {
      path: "absences/confirm",
      component: ConfirmAbsencesComponent,
    },
    { path: "dossier/edit/:id", component: StudentDossierEditComponent },
  ],
};
