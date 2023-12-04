import { Component, Input } from "@angular/core";
import { uniqueId } from "lodash-es";
import { ReportInfo } from "../../services/reports.service";

@Component({
  selector: "erz-reports-link",
  templateUrl: "./reports-link.component.html",
  styleUrls: ["./reports-link.component.scss"],
})
export class ReportsLinkComponent {
  @Input() reports: ReadonlyArray<ReportInfo> = [];
  @Input() disableIfUnavailable = false;

  dropdownId = uniqueId("reports-link-dropdown");

  openReport(event: MouseEvent, report: Report): void {
    event.stopPropagation();
    window.open(report.url, "_blank");
  }
}
