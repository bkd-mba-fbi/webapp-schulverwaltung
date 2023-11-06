import { NgModule } from "@angular/core";
import { SharedModule } from "../shared/shared.module";
import { MyProfileAddressComponent } from "./components/my-profile-address/my-profile-address.component";
import { MyProfileEditComponent } from "./components/my-profile-edit/my-profile-edit.component";
import { MyProfileEntryComponent } from "./components/my-profile-entry/my-profile-entry.component";
import { MyProfileHeaderComponent } from "./components/my-profile-header/my-profile-header.component";
import { MyProfileShowComponent } from "./components/my-profile-show/my-profile-show.component";
import { MyProfileComponent } from "./components/my-profile/my-profile.component";
import { MyProfileRoutingModule } from "./my-profile-routing.module";

@NgModule({
  declarations: [
    MyProfileComponent,
    MyProfileShowComponent,
    MyProfileEntryComponent,
    MyProfileHeaderComponent,
    MyProfileAddressComponent,
    MyProfileEditComponent,
  ],
  providers: [],
  imports: [SharedModule, MyProfileRoutingModule],
})
export class MyProfileModule {}
