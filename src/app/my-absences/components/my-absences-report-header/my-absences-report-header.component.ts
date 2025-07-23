import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from "@angular/core";
import {
  NgbDateAdapter,
  NgbDateNativeAdapter,
  NgbDateParserFormatter,
} from "@ng-bootstrap/ng-bootstrap";
import { TranslatePipe } from "@ngx-translate/core";
import { startOfDay } from "date-fns/startOfDay";
import { DateParserFormatter } from "src/app/shared/services/date-parser-formatter";
import { BacklinkComponent } from "../../../shared/components/backlink/backlink.component";
import { DateSelectComponent } from "../../../shared/components/date-select/date-select.component";
import { ReportAbsencesFilter } from "../../services/my-absences-report-state.service";

@Component({
  selector: "bkd-my-absences-report-header",
  templateUrl: "./my-absences-report-header.component.html",
  styleUrls: ["./my-absences-report-header.component.scss"],
  providers: [
    { provide: NgbDateAdapter, useClass: NgbDateNativeAdapter },
    { provide: NgbDateParserFormatter, useClass: DateParserFormatter },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BacklinkComponent, DateSelectComponent, TranslatePipe],
})
export class MyAbsencesReportHeaderComponent {
  @Input()
  filter: ReportAbsencesFilter = {
    dateFrom: null,
    dateTo: null,
  };

  @Output() filterChange = new EventEmitter<ReportAbsencesFilter>();

  /**
   * User may not choose dates in the past
   */
  minDate = {
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    day: new Date().getDate(),
  };

  constructor() {}

  /**
   * Update date to the same date, if date from changes.
   */
  updateDateFrom(date: Option<Date>): void {
    this.filter.dateFrom = date;
    if (date) {
      this.filter.dateTo = date;
    }
  }

  show(): void {
    this.filterChange.emit({
      // Normalize the dates' times to 00:00 to be comparable
      dateFrom: normalizeDate(this.filter.dateFrom),
      dateTo: normalizeDate(this.filter.dateTo),
    });
  }
}

function normalizeDate(date: Option<Date>): Option<Date> {
  return date ? startOfDay(date) : null;
}
