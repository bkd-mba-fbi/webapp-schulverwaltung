import { Routes } from "@angular/router";
import { dossierRoute } from "../shared/components/student-dossier/dossier-route";
import { DashboardComponent } from "./components/dashboard/dashboard.component";

export const DASHBOARD_ROUTES: Routes = [
  {
    path: "",
    component: DashboardComponent,
  },
  dossierRoute,
];
