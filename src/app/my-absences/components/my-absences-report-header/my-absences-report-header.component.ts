import {
  ChangeDetectionStrategy,
  Component,
  linkedSignal,
  model,
} from "@angular/core";
import { TranslatePipe } from "@ngx-translate/core";
import { startOfDay } from "date-fns/startOfDay";
import { BacklinkComponent } from "../../../shared/components/backlink/backlink.component";
import { DateSelectComponent } from "../../../shared/components/date-select/date-select.component";
import { ReportAbsencesFilter } from "../../services/my-absences-report-state.service";

@Component({
  selector: "bkd-my-absences-report-header",
  templateUrl: "./my-absences-report-header.component.html",
  styleUrls: ["./my-absences-report-header.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BacklinkComponent, DateSelectComponent, TranslatePipe],
})
export class MyAbsencesReportHeaderComponent {
  readonly filter = model<ReportAbsencesFilter>({
    dateFrom: null,
    dateTo: null,
  });

  /**
   * The filter currently being edited. Changes stay local until they get
   * committed to `filter` by `show`, in order to not reload the entries
   * on every single change.
   */
  protected readonly intermediateFilter = linkedSignal(() => this.filter());

  /**
   * User may not choose dates in the past
   */
  protected readonly minDate = {
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    day: new Date().getDate(),
  };

  constructor() {}

  /**
   * Update date to the same date, if date from changes.
   */
  protected updateDateFrom(date: Option<Date>): void {
    this.intermediateFilter.update((current) => ({
      ...current,
      dateFrom: date,
      dateTo: date ?? current.dateTo,
    }));
  }

  protected updateDateTo(date: Option<Date>): void {
    this.intermediateFilter.update((current) => ({ ...current, dateTo: date }));
  }

  protected show(): void {
    const intermediateFilter = this.intermediateFilter();
    this.filter.set({
      // Normalize the dates' times to 00:00 to be comparable
      dateFrom: normalizeDate(intermediateFilter.dateFrom),
      dateTo: normalizeDate(intermediateFilter.dateTo),
    });
  }
}

function normalizeDate(date: Option<Date>): Option<Date> {
  return date ? startOfDay(date) : null;
}
