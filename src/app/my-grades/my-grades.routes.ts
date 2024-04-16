import { Routes } from "@angular/router";
import { MyGradesShowComponent } from "./components/my-grades-show/my-grades-show.component";
import { MyGradesComponent } from "./components/my-grades/my-grades.component";

export const MY_GRADES_ROUTES: Routes = [
  {
    path: "",
    component: MyGradesComponent,
    children: [{ path: "", component: MyGradesShowComponent }],
  },
];
