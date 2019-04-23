import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PraesenzkontrolleRoutingModule } from './praesenzkontrolle-routing.module';
import { PraesenzkontrolleComponent } from './praesenzkontrolle.component';

@NgModule({
  declarations: [PraesenzkontrolleComponent],
  imports: [
    CommonModule,
    PraesenzkontrolleRoutingModule
  ]
})
export class PraesenzkontrolleModule { }
