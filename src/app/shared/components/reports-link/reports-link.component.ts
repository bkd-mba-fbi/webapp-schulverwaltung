import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from "@angular/core";
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportsLinkComponent {
  readonly reports = input.required<ReadonlyArray<ReportInfo>>();
  readonly disableIfUnavailable = input(false);

  private readonly storageService = inject(StorageService);

  protected readonly dropdownId = uniqueId("reports-link-dropdown");

  protected openReport(report: ReportInfo): void {
    window.open(this.addTokenToUrl(report), "_blank");
  }

  private addTokenToUrl(report: ReportInfo): URL {
    const url = new URL(report.url);
    url.searchParams.set("token", this.storageService.getAccessToken() ?? "");
    return url;
  }
}
