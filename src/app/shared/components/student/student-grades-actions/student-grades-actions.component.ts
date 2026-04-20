import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { ReportInfo } from "src/app/shared/services/reports.service";
import { ReportsLinkComponent } from "../../reports-link/reports-link.component";

@Component({
  selector: "bkd-student-grades-actions",
  imports: [ReportsLinkComponent],
  templateUrl: "./student-grades-actions.component.html",
  styleUrl: "./student-grades-actions.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentGradesActionsComponent {
  reports = input.required<ReadonlyArray<ReportInfo>>();
}
