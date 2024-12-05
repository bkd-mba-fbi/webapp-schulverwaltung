import { ChangeDetectionStrategy, Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { ConfirmAbsencesSelectionService } from "../../../shared/services/confirm-absences-selection.service";
import { DashboardService } from "../../services/dashboard.service";

@Component({
  selector: "bkd-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet],
  providers: [DashboardService, ConfirmAbsencesSelectionService],
})
export class DashboardComponent {
  constructor() {}
}
