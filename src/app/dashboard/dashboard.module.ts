import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DashboardSearchComponent } from './components/dashboard-search/dashboard-search.component';

@NgModule({
  declarations: [DashboardComponent, DashboardSearchComponent],
  imports: [SharedModule, DashboardRoutingModule],
})
export class DashboardModule {}
