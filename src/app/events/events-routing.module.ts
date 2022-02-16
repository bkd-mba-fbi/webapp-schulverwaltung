import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoursesComponent } from './components/courses/courses.component';
import { TestsComponent } from './components/tests/tests.component';
import { TestsListComponent } from './components/tests-list/tests-list.component';
import { CoursesListComponent } from './components/courses-list/courses-list.component';
import { TestsHeaderComponent } from './components/tests-header/tests-header.component';

const routes: Routes = [
  {
    path: '',
    component: CoursesComponent,
    children: [
      {
        path: '',
        component: CoursesListComponent,
      },
    ],
  },
  {
    path: ':id/tests',
    component: TestsComponent,
    children: [
      { path: '', component: TestsListComponent },
      { path: '', component: TestsHeaderComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EventsRoutingModule {}
