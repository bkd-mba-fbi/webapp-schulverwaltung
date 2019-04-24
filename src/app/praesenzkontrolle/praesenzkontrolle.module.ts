import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { PraesenzkontrolleRoutingModule } from './praesenzkontrolle-routing.module';
import { PraesenzkontrolleComponent } from './praesenzkontrolle.component';

@NgModule({
  declarations: [PraesenzkontrolleComponent],
  imports: [SharedModule, PraesenzkontrolleRoutingModule]
})
export class PraesenzkontrolleModule {}
