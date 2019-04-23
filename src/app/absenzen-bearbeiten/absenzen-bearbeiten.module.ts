import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AbsenzenBearbeitenRoutingModule } from './absenzen-bearbeiten-routing.module';
import { AbsenzenBearbeitenComponent } from './absenzen-bearbeiten.component';

@NgModule({
  declarations: [AbsenzenBearbeitenComponent],
  imports: [CommonModule, AbsenzenBearbeitenRoutingModule]
})
export class AbsenzenBearbeitenModule {}
