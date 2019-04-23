import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AbsenzenAuswertenRoutingModule } from './absenzen-auswerten-routing.module';
import { AbsenzenAuswertenComponent } from './absenzen-auswerten.component';

@NgModule({
  declarations: [AbsenzenAuswertenComponent],
  imports: [CommonModule, AbsenzenAuswertenRoutingModule]
})
export class AbsenzenAuswertenModule {}
