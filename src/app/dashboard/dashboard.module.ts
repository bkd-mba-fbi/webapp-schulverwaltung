import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DashboardSearchComponent } from './components/dashboard-search/dashboard-search.component';
import { DashboardActionsComponent } from './components/dashboard-actions/dashboard-actions.component';
import { DashboardActionComponent } from './components/dashboard-action/dashboard-action.component';

@NgModule({
  declarations: [
    DashboardComponent,
    DashboardSearchComponent,
    DashboardActionsComponent,
    DashboardActionComponent,
  ],
  imports: [SharedModule, DashboardRoutingModule],
})
export class DashboardModule {}
