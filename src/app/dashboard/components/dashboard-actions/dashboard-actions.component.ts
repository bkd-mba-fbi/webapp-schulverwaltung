import { AsyncPipe, NgIf } from "@angular/common";
import { Component, Inject } from "@angular/core";
import { SETTINGS, Settings } from "../../../settings";
import { DashboardService } from "../../services/dashboard.service";
import { DashboardActionComponent } from "../dashboard-action/dashboard-action.component";
import { DashboardDeadlineComponent } from "../dashboard-deadline/dashboard-deadline.component";

@Component({
  selector: "erz-dashboard-actions",
  templateUrl: "./dashboard-actions.component.html",
  styleUrls: ["./dashboard-actions.component.scss"],
  standalone: true,
  imports: [
    NgIf,
    DashboardActionComponent,
    DashboardDeadlineComponent,
    AsyncPipe,
  ],
})
export class DashboardActionsComponent {
  constructor(
    public dashboardService: DashboardService,
    @Inject(SETTINGS) public settings: Settings,
  ) {}

  get substitutionsAdminLink(): string {
    return this.settings.dashboard.substitutionsAdminLink;
  }
}
