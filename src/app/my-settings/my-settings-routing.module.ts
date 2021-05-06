import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MySettingsShowComponent } from './components/my-settings-show/my-settings-show.component';
import { MySettingsComponent } from './components/my-settings/my-settings.component';

const routes: Routes = [
  {
    path: '',
    component: MySettingsComponent,
    children: [{ path: '', component: MySettingsShowComponent }],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MySettingsRoutingModule {}
