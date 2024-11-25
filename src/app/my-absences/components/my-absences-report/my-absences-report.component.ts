import { ChangeDetectionStrategy, Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { MyAbsencesReportSelectionService } from "../../services/my-absences-report-selection.service";
import { MyAbsencesReportStateService } from "../../services/my-absences-report-state.service";

@Component({
  selector: "bkd-my-absences-report",
  templateUrl: "./my-absences-report.component.html",
  styleUrls: ["./my-absences-report.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [MyAbsencesReportStateService, MyAbsencesReportSelectionService],
  imports: [RouterOutlet],
})
export class MyAbsencesReportComponent {
  constructor() {}
}
