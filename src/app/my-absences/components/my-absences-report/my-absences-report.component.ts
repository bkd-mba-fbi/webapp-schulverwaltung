import { ChangeDetectionStrategy, Component } from "@angular/core";
import { MyAbsencesReportSelectionService } from "../../services/my-absences-report-selection.service";
import { MyAbsencesReportStateService } from "../../services/my-absences-report-state.service";

@Component({
  selector: "erz-my-absences-report",
  templateUrl: "./my-absences-report.component.html",
  styleUrls: ["./my-absences-report.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [MyAbsencesReportStateService, MyAbsencesReportSelectionService],
})
export class MyAbsencesReportComponent {
  constructor() {}
}
