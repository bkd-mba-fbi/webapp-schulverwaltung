import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { OffeneAbsenzenRoutingModule } from './offene-absenzen-routing.module';
import { OffeneAbsenzenComponent } from './offene-absenzen.component';

@NgModule({
  declarations: [OffeneAbsenzenComponent],
  imports: [SharedModule, OffeneAbsenzenRoutingModule]
})
export class OffeneAbsenzenModule {}
