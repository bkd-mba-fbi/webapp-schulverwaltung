import { Routes } from "@angular/router";
import { dossierRoute } from "../shared/components/student-dossier/dossier-route";
import { PresenceControlGroupComponent } from "./components/presence-control-group/presence-control-group.component";
import { PresenceControlListComponent } from "./components/presence-control-list/presence-control-list.component";
import { PresenceControlComponent } from "./components/presence-control/presence-control.component";

export const PRESENCE_CONTROL_ROUTES: Routes = [
  {
    path: "",
    component: PresenceControlComponent,
    children: [
      {
        path: "",
        component: PresenceControlListComponent,
        data: {
          restoreScrollPositionFrom: [
            "/presence-control/student/:id/addresses",
            "/presence-control/student/:id/absences",
            "/presence-control/student/:id/grades",
          ],
        },
      },
      dossierRoute,
      {
        path: "groups/:id",
        component: PresenceControlGroupComponent,
      },
    ],
  },
];
