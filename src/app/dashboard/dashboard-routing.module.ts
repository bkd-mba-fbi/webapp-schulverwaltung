import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { DashboardComponent } from "./components/dashboard/dashboard.component";
import { dossierRoute } from "../shared/components/student-dossier/dossier-route";

const routes: Routes = [
  {
    path: "",
    component: DashboardComponent,
  },
  dossierRoute,
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
