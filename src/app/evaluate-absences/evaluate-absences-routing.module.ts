import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { dossierRoute } from "../shared/components/student-dossier/dossier-route";
import { EvaluateAbsencesListComponent } from "./components/evaluate-absences-list/evaluate-absences-list.component";
import { EvaluateAbsencesComponent } from "./components/evaluate-absences/evaluate-absences.component";

const routes: Routes = [
  {
    path: "",
    component: EvaluateAbsencesComponent,
    children: [
      {
        path: "",
        component: EvaluateAbsencesListComponent,
        data: {
          restoreScrollPositionFrom: ["/evaluate-absences/student/:id"],
        },
      },
      dossierRoute,
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EvaluateAbsencesRoutingModule {}
