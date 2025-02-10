import { Routes } from "@angular/router";
import { dossierRoute } from "../shared/components/student-dossier/dossier-route";
import { DOSSIER_PAGES } from "../shared/services/dossier-state.service";
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
          restoreScrollPositionFrom: DOSSIER_PAGES.map(
            (page) => `/presence-control/student/:id/${page}`,
          ),
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
