import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MyGradesComponent } from './components/my-grades/my-grades.component';

const routes: Routes = [
  {
    path: '',
    component: MyGradesComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyGradesRoutingModule {}
