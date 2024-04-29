import { Routes } from "@angular/router";
import { dossierRoute } from "../shared/components/student-dossier/dossier-route";
import { DashboardLayoutComponent } from "./components/dashboard-layout/dashboard-layout.component";
import { DashboardComponent } from "./components/dashboard/dashboard.component";

export const DASHBOARD_ROUTES: Routes = [
  {
    path: "",
    component: DashboardComponent,
    children: [{ path: "", component: DashboardLayoutComponent }, dossierRoute],
  },
];
