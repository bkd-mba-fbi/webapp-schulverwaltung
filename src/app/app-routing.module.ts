import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home.component';
import { authGuard } from './auth.guard';
import { UnauthenticatedComponent } from './unauthenticated.component';

const routes: Routes = [
  {
    path: 'dashboard',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
  },
  {
    path: 'presence-control',
    canActivate: [authGuard()],
    loadChildren: () =>
      import('./presence-control/presence-control.module').then(
        (m) => m.PresenceControlModule,
      ),
  },
  {
    path: 'open-absences',
    canActivate: [authGuard()],
    loadChildren: () =>
      import('./open-absences/open-absences.module').then(
        (m) => m.OpenAbsencesModule,
      ),
  },
  {
    path: 'edit-absences',
    canActivate: [authGuard()],
    loadChildren: () =>
      import('./edit-absences/edit-absences.module').then(
        (m) => m.EditAbsencesModule,
      ),
  },
  {
    path: 'evaluate-absences',
    canActivate: [authGuard()],
    loadChildren: () =>
      import('./evaluate-absences/evaluate-absences.module').then(
        (m) => m.EvaluateAbsencesModule,
      ),
  },
  {
    path: 'events',
    canActivate: [authGuard()],
    loadChildren: () =>
      import('./events/events.module').then((m) => m.EventsModule),
  },
  {
    path: 'my-absences',
    canActivate: [authGuard()],
    loadChildren: () =>
      import('./my-absences/my-absences.module').then(
        (m) => m.MyAbsencesModule,
      ),
  },
  {
    path: 'my-profile',
    canActivate: [authGuard()],
    loadChildren: () =>
      import('./my-profile/my-profile.module').then((m) => m.MyProfileModule),
  },
  {
    path: 'my-grades',
    canActivate: [authGuard()],
    loadChildren: () =>
      import('./my-grades/my-grades.module').then((m) => m.MyGradesModule),
  },
  {
    path: 'my-settings',
    canActivate: [authGuard()],
    loadChildren: () =>
      import('./my-settings/my-settings.module').then(
        (m) => m.MySettingsModule,
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
