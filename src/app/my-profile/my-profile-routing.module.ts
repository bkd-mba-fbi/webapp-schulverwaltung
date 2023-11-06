import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { MyProfileEditComponent } from "./components/my-profile-edit/my-profile-edit.component";
import { MyProfileShowComponent } from "./components/my-profile-show/my-profile-show.component";
import { MyProfileComponent } from "./components/my-profile/my-profile.component";

const routes: Routes = [
  {
    path: "",
    component: MyProfileComponent,
    children: [
      { path: "", component: MyProfileShowComponent },
      { path: "edit", component: MyProfileEditComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyProfileRoutingModule {}
