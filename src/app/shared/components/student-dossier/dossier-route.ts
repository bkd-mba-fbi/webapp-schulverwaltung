import { Route } from "@angular/router";
import { ConfirmAbsencesComponent } from "../confirm-absences/confirm-absences.component";
import { DossierAbsencesComponent } from "./dossier-absences/dossier-absences.component";
import { DossierContactComponent } from "./dossier-contact/dossier-contact.component";
import { DossierGradesComponent } from "./dossier-grades/dossier-grades.component";
import { StudentDossierComponent } from "./student-dossier/student-dossier.component";

export const dossierRoute: Route = {
  path: "student/:id",
  children: [
    {
      path: "",
      component: StudentDossierComponent,
      children: [
        { path: "contact", component: DossierContactComponent },
        { path: "absences", component: DossierAbsencesComponent },
        { path: "grades", component: DossierGradesComponent },
      ],
    },
    {
      path: "absences/confirm",
      component: ConfirmAbsencesComponent,
    },
  ],
};
