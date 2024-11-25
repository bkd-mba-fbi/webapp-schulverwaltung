import { AsyncPipe } from "@angular/common";
import { ChangeDetectionStrategy, Component } from "@angular/core";
import { TranslatePipe } from "@ngx-translate/core";
import { SpinnerComponent } from "../../../shared/components/spinner/spinner.component";
import { DashboardService } from "../../services/dashboard.service";
import { DashboardActionsComponent } from "../dashboard-actions/dashboard-actions.component";
import { DashboardSearchComponent } from "../dashboard-search/dashboard-search.component";
import { DashboardTimetableComponent } from "../dashboard-timetable/dashboard-timetable.component";

@Component({
  selector: "bkd-dashboard-layout",
  templateUrl: "./dashboard-layout.component.html",
  styleUrls: ["./dashboard-layout.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    SpinnerComponent,
    DashboardSearchComponent,
    DashboardActionsComponent,
    DashboardTimetableComponent,
    AsyncPipe,
    TranslatePipe,
  ],
})
export class DashboardLayoutComponent {
  constructor(public dashboardService: DashboardService) {}
}
