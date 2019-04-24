import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { AbsenzenAuswertenRoutingModule } from './absenzen-auswerten-routing.module';
import { AbsenzenAuswertenComponent } from './absenzen-auswerten.component';

@NgModule({
  declarations: [AbsenzenAuswertenComponent],
  imports: [SharedModule, AbsenzenAuswertenRoutingModule]
})
export class AbsenzenAuswertenModule {}
