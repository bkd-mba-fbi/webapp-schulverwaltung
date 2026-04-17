import { Routes } from "@angular/router";
import { STUDENT_PAGES } from "../shared/components/student/student-pages";
import { studentRoute } from "../shared/components/student/student-route";
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
          restoreScrollPositionFrom: STUDENT_PAGES.map(
            (page) => `/presence-control/student/:id/${page}`,
          ),
        },
      },
      studentRoute,
      {
        path: "groups/:id",
        component: PresenceControlGroupComponent,
      },
    ],
  },
];
