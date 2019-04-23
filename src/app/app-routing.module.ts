import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home.component';

const routes: Routes = [
  {
    path: 'praesenzkontrolle',
    loadChildren:
      './praesenzkontrolle/praesenzkontrolle.module#PraesenzkontrolleModule'
  },
  {
    path: 'offene-absenzen',
    loadChildren:
      './offene-absenzen/offene-absenzen.module#OffeneAbsenzenModule'
  },
  {
    path: 'absenzen-bearbeiten',
    loadChildren:
      './absenzen-bearbeiten/absenzen-bearbeiten.module#AbsenzenBearbeitenModule'
  },
  {
    path: 'absenzen-auswerten',
    loadChildren:
      './absenzen-auswerten/absenzen-auswerten.module#AbsenzenAuswertenModule'
  },
  {
    path: '',
    component: HomeComponent,
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
