import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DashboardSearchComponent } from './components/dashboard-search/dashboard-search.component';
import { DashboardActionsComponent } from './components/dashboard-actions/dashboard-actions.component';
import { DashboardActionComponent } from './components/dashboard-action/dashboard-action.component';
import { DashboardTimetableComponent } from './components/dashboard-timetable/dashboard-timetable.component';
import { DashboardTimetableTableComponent } from './components/dashboard-timetable-table/dashboard-timetable-table.component';
import { DashboardService } from './services/dashboard.service';

@NgModule({
  declarations: [
    DashboardComponent,
    DashboardSearchComponent,
    DashboardActionsComponent,
    DashboardActionComponent,
    DashboardTimetableComponent,
    DashboardTimetableTableComponent,
    DashboardPillComponent,
  ],
  providers: [DashboardService],
  imports: [SharedModule, DashboardRoutingModule],
})
export class DashboardModule {}
