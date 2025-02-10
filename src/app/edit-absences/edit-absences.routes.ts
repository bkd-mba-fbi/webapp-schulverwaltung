import { Routes } from "@angular/router";
import { dossierRoute } from "../shared/components/student-dossier/dossier-route";
import { DOSSIER_PAGES } from "../shared/services/dossier-state.service";
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
            ...DOSSIER_PAGES.map(
              (page) => `/edit-absences/student/:id/${page}`,
            ),
          ],
        },
      },
      {
        path: "edit",
        component: EditAbsencesEditComponent,
      },
      dossierRoute,
    ],
  },
];
