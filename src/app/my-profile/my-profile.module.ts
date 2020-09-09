import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

import { MyProfileRoutingModule } from './my-profile-routing.module';
import { MyProfileComponent } from './components/my-profile/my-profile.component';
import { MyProfileEntryComponent } from './components/my-profile-entry/my-profile-entry.component';
import { MyProfileHeaderComponent } from './components/my-profile-header/my-profile-header.component';
import { MyProfileAddressComponent } from './components/my-profile-address/my-profile-address.component';

@NgModule({
  declarations: [
    MyProfileComponent,
    MyProfileEntryComponent,
    MyProfileHeaderComponent,
    MyProfileAddressComponent,
  ],
  imports: [SharedModule, MyProfileRoutingModule],
})
export class MyProfileModule {}
