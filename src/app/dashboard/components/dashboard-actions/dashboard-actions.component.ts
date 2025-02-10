import { AsyncPipe } from "@angular/common";
import { Component, inject } from "@angular/core";
import { SETTINGS, Settings } from "../../../settings";
import { DashboardService } from "../../services/dashboard.service";
import { DashboardActionComponent } from "../dashboard-action/dashboard-action.component";
import { DashboardDeadlineComponent } from "../dashboard-deadline/dashboard-deadline.component";

@Component({
  selector: "bkd-dashboard-actions",
  templateUrl: "./dashboard-actions.component.html",
  styleUrls: ["./dashboard-actions.component.scss"],
  imports: [DashboardActionComponent, DashboardDeadlineComponent, AsyncPipe],
})
export class DashboardActionsComponent {
  dashboardService = inject(DashboardService);
  settings = inject<Settings>(SETTINGS);

  get substitutionsAdminLink(): string {
    return this.settings.dashboard.substitutionsAdminLink;
  }
}
