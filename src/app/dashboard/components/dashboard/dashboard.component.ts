import { ChangeDetectionStrategy, Component } from "@angular/core";
import { DashboardService } from "../../services/dashboard.service";

@Component({
  selector: "erz-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  constructor(public dashboardService: DashboardService) {}
}
