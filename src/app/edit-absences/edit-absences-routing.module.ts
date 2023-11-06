import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { dossierRoute } from "../shared/components/student-dossier/dossier-route";
import { EditAbsencesEditComponent } from "./components/edit-absences-edit/edit-absences-edit.component";
import { EditAbsencesListComponent } from "./components/edit-absences-list/edit-absences-list.component";
import { EditAbsencesComponent } from "./components/edit-absences/edit-absences.component";

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
