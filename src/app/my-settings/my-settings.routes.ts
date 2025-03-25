import { Routes } from "@angular/router";
import { MySettingsShowComponent } from "./components/my-settings-show/my-settings-show.component";
import { MySettingsComponent } from "./components/my-settings/my-settings.component";

export const MY_SETTINGS_ROUTES: Routes = [
  {
    path: "",
    component: MySettingsComponent,
    children: [{ path: "", component: MySettingsShowComponent }],
  },
];
