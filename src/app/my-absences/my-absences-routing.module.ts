import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MyAbsencesComponent } from './components/my-absences/my-absences.component';
import { MyAbsencesShowComponent } from './components/my-absences-show/my-absences-show.component';
import { MyAbsencesConfirmComponent } from './components/my-absences-confirm/my-absences-confirm.component';
import { MyAbsencesReportComponent } from './components/my-absences-report/my-absences-report.component';

const routes: Routes = [
  {
    path: '',
    component: MyAbsencesComponent,
    children: [
      { path: '', component: MyAbsencesShowComponent },
      { path: 'confirm', component: MyAbsencesConfirmComponent },
      { path: 'report', component: MyAbsencesReportComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyAbsencesRoutingModule {}
