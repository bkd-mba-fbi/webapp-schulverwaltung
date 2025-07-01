import { Component, Input, inject } from "@angular/core";
import {
  NgbDropdown,
  NgbDropdownButtonItem,
  NgbDropdownItem,
  NgbDropdownMenu,
  NgbDropdownToggle,
} from "@ng-bootstrap/ng-bootstrap";
import { uniqueId } from "lodash-es";
import { ReportInfo } from "../../services/reports.service";
import { StorageService } from "../../services/storage.service";

@Component({
  selector: "bkd-reports-link",
  templateUrl: "./reports-link.component.html",
  styleUrls: ["./reports-link.component.scss"],
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

  private storageService = inject(StorageService);

  dropdownId = uniqueId("reports-link-dropdown");

  openReport(report: ReportInfo): void {
    window.open(this.addTokenToUrl(report), "_blank");
  }

  addTokenToUrl(report: ReportInfo): string {
    const url = new URL(report.url);
    url.searchParams.set("token", this.storageService.getAccessToken() ?? "");
    return url.toString();
  }
}
