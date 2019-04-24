import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { AbsenzenBearbeitenRoutingModule } from './absenzen-bearbeiten-routing.module';
import { AbsenzenBearbeitenComponent } from './absenzen-bearbeiten.component';

@NgModule({
  declarations: [AbsenzenBearbeitenComponent],
  imports: [SharedModule, AbsenzenBearbeitenRoutingModule]
})
export class AbsenzenBearbeitenModule {}
