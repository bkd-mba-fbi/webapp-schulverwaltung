import { Routes } from "@angular/router";
import { MyAbsencesConfirmComponent } from "./components/my-absences-confirm/my-absences-confirm.component";
import { MyAbsencesReportConfirmComponent } from "./components/my-absences-confirm/my-absences-report-confirm.component";
import { MyAbsencesReportListComponent } from "./components/my-absences-report-list/my-absences-report-list.component";
import { MyAbsencesReportComponent } from "./components/my-absences-report/my-absences-report.component";
import { MyAbsencesShowComponent } from "./components/my-absences-show/my-absences-show.component";
import { MyAbsencesComponent } from "./components/my-absences/my-absences.component";

export const MY_ABSENCES_ROUTES: Routes = [
  {
    path: "",
    component: MyAbsencesComponent,
    children: [
      { path: "", component: MyAbsencesShowComponent },
      { path: "confirm", component: MyAbsencesConfirmComponent },
      {
        path: "report",
        component: MyAbsencesReportComponent,
        children: [
          {
            path: "",
            component: MyAbsencesReportListComponent,
            data: {
              restoreScrollPositionFrom: ["/my-absences/report/confirm"],
            },
          },
          { path: "confirm", component: MyAbsencesReportConfirmComponent },
        ],
      },
    ],
  },
];
