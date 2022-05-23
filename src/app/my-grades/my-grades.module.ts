import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MyGradesRoutingModule } from './my-grades-routing.module';
import { MyGradesComponent } from './components/my-grades/my-grades.component';
import { MyGradesShowComponent } from './components/my-grades-show/my-grades-show.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [MyGradesComponent, MyGradesShowComponent],
  imports: [CommonModule, MyGradesRoutingModule, SharedModule],
})
export class MyGradesModule {}
