import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

import { MyProfileRoutingModule } from './my-profile-routing.module';
import { MyProfileComponent } from './components/my-profile.component';
import { MyProfileEntryComponent } from './my-profile-entry/my-profile-entry.component';

@NgModule({
  declarations: [MyProfileComponent, MyProfileEntryComponent],
  imports: [SharedModule, MyProfileRoutingModule],
})
export class MyProfileModule {}
