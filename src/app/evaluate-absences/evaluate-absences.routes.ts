import { Routes } from "@angular/router";
import { studentRoute } from "../shared/components/student/student-route";
import { EvaluateAbsencesListComponent } from "./components/evaluate-absences-list/evaluate-absences-list.component";
import { EvaluateAbsencesComponent } from "./components/evaluate-absences/evaluate-absences.component";

export const EVALUATE_ABSENCES_ROUTES: Routes = [
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
      studentRoute,
    ],
  },
];
