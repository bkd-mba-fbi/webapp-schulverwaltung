import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { EditAbsencesComponent } from "./components/edit-absences/edit-absences.component";
import { EditAbsencesListComponent } from "./components/edit-absences-list/edit-absences-list.component";
import { EditAbsencesEditComponent } from "./components/edit-absences-edit/edit-absences-edit.component";
import { dossierRoute } from "../shared/components/student-dossier/dossier-route";

const routes: Routes = [
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
            "/edit-absences/student/:id/addresses",
            "/edit-absences/student/:id/absences",
            "/edit-absences/student/:id/grades",
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

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditAbsencesRoutingModule {}
