import { Routes } from "@angular/router";
import { ConfirmAbsencesComponent } from "../shared/components/confirm-absences/confirm-absences.component";
import { OpenAbsencesDetailComponent } from "./components/open-absences-detail/open-absences-detail.component";
import { OpenAbsencesListComponent } from "./components/open-absences-list/open-absences-list.component";
import { OpenAbsencesComponent } from "./components/open-absences/open-absences.component";

export const OPEN_ABSENCES_ROUTES: Routes = [
  {
    path: "",
    component: OpenAbsencesComponent,
    children: [
      {
        path: "",
        component: OpenAbsencesListComponent,
        data: {
          restoreScrollPositionFrom: [
            "/open-absences/detail/:personId/:date",
            "/open-absences/confirm",
          ],
        },
      },
      {
        path: "detail/:personId/:date",
        component: OpenAbsencesDetailComponent,
        data: { restoreScrollPositionFrom: ["/open-absences/confirm"] },
      },
      {
        path: "confirm",
        component: ConfirmAbsencesComponent,
      },
    ],
  },
];
