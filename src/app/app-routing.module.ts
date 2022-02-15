import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home.component';
import { AuthGuard } from './auth.guard';
import { UnauthenticatedComponent } from './unauthenticated.component';

const routes: Routes = [
  {
    path: 'presence-control',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./presence-control/presence-control.module').then(
        (m) => m.PresenceControlModule
      ),
  },
  {
    path: 'open-absences',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./open-absences/open-absences.module').then(
        (m) => m.OpenAbsencesModule
      ),
  },
  {
    path: 'edit-absences',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./edit-absences/edit-absences.module').then(
        (m) => m.EditAbsencesModule
      ),
  },
  {
    path: 'evaluate-absences',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./evaluate-absences/evaluate-absences.module').then(
        (m) => m.EvaluateAbsencesModule
      ),
  },
  {
    path: 'events',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./events/events.module').then((m) => m.EventsModule),
  },
  {
    path: 'my-absences',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./my-absences/my-absences.module').then(
        (m) => m.MyAbsencesModule
      ),
  },
  {
    path: 'my-profile',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./my-profile/my-profile.module').then((m) => m.MyProfileModule),
  },
  {
    path: 'my-settings',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./my-settings/my-settings.module').then(
        (m) => m.MySettingsModule
      ),
  },
  { path: 'unauthenticated', component: UnauthenticatedComponent },
  {
    path: '',
    component: HomeComponent,
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      useHash: true,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
