import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MyProfileComponent } from './components/my-profile/my-profile.component';
import { MyProfileShowComponent } from './components/my-profile-show/my-profile-show.component';
import { MyProfileEditComponent } from './components/my-profile-edit/my-profile-edit.component';

const routes: Routes = [
  {
    path: '',
    component: MyProfileComponent,
    children: [
      { path: '', component: MyProfileShowComponent },
      { path: 'edit', component: MyProfileEditComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyProfileRoutingModule {}
