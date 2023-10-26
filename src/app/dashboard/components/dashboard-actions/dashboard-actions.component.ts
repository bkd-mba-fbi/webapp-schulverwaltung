import { Component, Inject } from "@angular/core";
import { Settings, SETTINGS } from "../../../settings";
import { DashboardService } from "../../services/dashboard.service";

@Component({
  selector: "erz-dashboard-actions",
  templateUrl: "./dashboard-actions.component.html",
  styleUrls: ["./dashboard-actions.component.scss"],
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
