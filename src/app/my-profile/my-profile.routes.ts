import { Routes } from "@angular/router";
import { MyProfileEditComponent } from "./components/my-profile-edit/my-profile-edit.component";
import { MyProfileShowComponent } from "./components/my-profile-show/my-profile-show.component";
import { MyProfileComponent } from "./components/my-profile/my-profile.component";

export const MY_PROFILE_ROUTES: Routes = [
  {
    path: "",
    component: MyProfileComponent,
    children: [
      { path: "", component: MyProfileShowComponent },
      { path: "edit", component: MyProfileEditComponent },
    ],
  },
];
