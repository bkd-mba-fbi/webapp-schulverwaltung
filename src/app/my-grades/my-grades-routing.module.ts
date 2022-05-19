import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MyGradesComponent } from './components/my-grades/my-grades.component';
import { MyGradesShowComponent } from './components/my-grades-show/my-grades-show.component';

const routes: Routes = [
  {
    path: '',
    component: MyGradesComponent,
    children: [{ path: '', component: MyGradesShowComponent }],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyGradesRoutingModule {}
