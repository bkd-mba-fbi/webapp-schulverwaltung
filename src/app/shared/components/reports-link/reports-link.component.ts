import { Component, Input } from "@angular/core";
import {
  NgbDropdown,
  NgbDropdownButtonItem,
  NgbDropdownItem,
  NgbDropdownMenu,
  NgbDropdownToggle,
} from "@ng-bootstrap/ng-bootstrap";
import { uniqueId } from "lodash-es";
import { ReportInfo } from "../../services/reports.service";

@Component({
  selector: "bkd-reports-link",
  templateUrl: "./reports-link.component.html",
  styleUrls: ["./reports-link.component.scss"],
  standalone: true,
  imports: [
    NgbDropdown,
    NgbDropdownToggle,
    NgbDropdownMenu,
    NgbDropdownButtonItem,
    NgbDropdownItem,
  ],
})
export class ReportsLinkComponent {
  @Input() reports: ReadonlyArray<ReportInfo> = [];
  @Input() disableIfUnavailable = false;

  dropdownId = uniqueId("reports-link-dropdown");

  openReport(report: ReportInfo): void {
    window.open(report.url, "_blank");
  }
}
