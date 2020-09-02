import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

import { MyProfileRoutingModule } from './my-profile-routing.module';
import { MyProfileComponent } from './components/my-profile.component';

@NgModule({
  declarations: [MyProfileComponent],
  imports: [SharedModule, MyProfileRoutingModule],
})
export class MyProfileModule {}
