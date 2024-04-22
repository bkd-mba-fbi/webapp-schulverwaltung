import { AsyncPipe, NgIf } from "@angular/common";
import { ChangeDetectionStrategy, Component } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";
import { SpinnerComponent } from "../../../shared/components/spinner/spinner.component";
import { LetDirective } from "../../../shared/directives/let.directive";
import { ConfirmAbsencesSelectionService } from "../../../shared/services/confirm-absences-selection.service";
import { DashboardService } from "../../services/dashboard.service";
import { DashboardActionsComponent } from "../dashboard-actions/dashboard-actions.component";
import { DashboardSearchComponent } from "../dashboard-search/dashboard-search.component";
import { DashboardTimetableComponent } from "../dashboard-timetable/dashboard-timetable.component";

@Component({
  selector: "bkd-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    LetDirective,
    NgIf,
    SpinnerComponent,
    DashboardSearchComponent,
    DashboardActionsComponent,
    DashboardTimetableComponent,
    AsyncPipe,
    TranslateModule,
  ],
  providers: [DashboardService, ConfirmAbsencesSelectionService],
})
export class DashboardComponent {
  constructor(public dashboardService: DashboardService) {}
}
