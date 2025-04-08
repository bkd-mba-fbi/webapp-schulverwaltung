import { Routes } from "@angular/router";
import { HomeComponent } from "./home/components/home.component";
import { UnauthenticatedComponent } from "./shared/components/unauthenticated.component";
import { authGuard } from "./shared/guards/auth.guard";
import { devModeGuard } from "./shared/guards/devMode.guard";

export const routes: Routes = [
  {
    path: "dashboard",
    canActivate: [authGuard()],
    loadChildren: () =>
      import("./dashboard/dashboard.routes").then((m) => m.DASHBOARD_ROUTES),
  },
  {
    path: "presence-control",
    canActivate: [authGuard()],
    loadChildren: () =>
      import("./presence-control/presence-control.routes").then(
        (m) => m.PRESENCE_CONTROL_ROUTES,
      ),
  },
  {
    path: "open-absences",
    canActivate: [authGuard()],
    loadChildren: () =>
      import("./open-absences/open-absences.routes").then(
        (m) => m.OPEN_ABSENCES_ROUTES,
      ),
  },
  {
    path: "edit-absences",
    canActivate: [authGuard()],
    loadChildren: () =>
      import("./edit-absences/edit-absences.routes").then(
        (m) => m.EDIT_ABSENCES_ROUTES,
      ),
  },
  {
    path: "evaluate-absences",
    canActivate: [authGuard()],
    loadChildren: () =>
      import("./evaluate-absences/evaluate-absences.routes").then(
        (m) => m.EVALUATE_ABSENCES_ROUTES,
      ),
  },
  {
    path: "events",
    canActivate: [authGuard()],
    loadChildren: () =>
      import("./events/events.routes").then((m) => m.EVENTS_ROUTES),
  },
  {
    path: "import",
    canActivate: [authGuard()],
    loadChildren: () =>
      import("./import/import.routes").then((m) => m.IMPORT_ROUTES),
  },
  {
    path: "my-absences",
    canActivate: [authGuard()],
    loadChildren: () =>
      import("./my-absences/my-absences.routes").then(
        (m) => m.MY_ABSENCES_ROUTES,
      ),
  },
  {
    path: "my-profile",
    canActivate: [authGuard()],
    loadChildren: () =>
      import("./my-profile/my-profile.routes").then((m) => m.MY_PROFILE_ROUTES),
  },
  {
    path: "my-grades",
    canActivate: [authGuard()],
    loadChildren: () =>
      import("./my-grades/my-grades.routes").then((m) => m.MY_GRADES_ROUTES),
  },
  {
    path: "my-settings",
    canActivate: [authGuard()],
    loadChildren: () =>
      import("./my-settings/my-settings.routes").then(
        (m) => m.MY_SETTINGS_ROUTES,
      ),
  },
  {
    path: "kitchensink",
    canActivate: [devModeGuard()],
    loadChildren: () =>
      import("./kitchensink/kitchensink.routes").then(
        (m) => m.KITCHENSINK_ROUTES,
      ),
  },
  {
    path: "api",
    canActivate: [authGuard(), devModeGuard()],
    loadChildren: () => import("./api/api.routes").then((m) => m.API_ROUTES),
  },
  { path: "unauthenticated", component: UnauthenticatedComponent },
  {
    path: "",
    component: HomeComponent,
    pathMatch: "full",
  },
];
