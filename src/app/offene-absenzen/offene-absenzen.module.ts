import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OffeneAbsenzenRoutingModule } from './offene-absenzen-routing.module';
import { OffeneAbsenzenComponent } from './offene-absenzen.component';

@NgModule({
  declarations: [OffeneAbsenzenComponent],
  imports: [
    CommonModule,
    OffeneAbsenzenRoutingModule
  ]
})
export class OffeneAbsenzenModule { }
