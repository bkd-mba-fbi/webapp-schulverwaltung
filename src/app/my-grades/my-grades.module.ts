import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MyGradesRoutingModule } from './my-grades-routing.module';
import { MyGradesComponent } from './components/my-grades/my-grades.component';

@NgModule({
  declarations: [MyGradesComponent],
  imports: [CommonModule, MyGradesRoutingModule],
})
export class MyGradesModule {}
