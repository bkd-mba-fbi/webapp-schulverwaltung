import {
  ChangeDetectionStrategy,
  Component,
  inject,
  linkedSignal,
  model,
} from "@angular/core";
import { TranslatePipe } from "@ngx-translate/core";
import { isAfter } from "date-fns/isAfter";
import { isBefore } from "date-fns/isBefore";
import { startOfDay } from "date-fns/startOfDay";
import { DateSelectComponent } from "src/app/shared/components/date-select/date-select.component";
import { CoursesRestService } from "src/app/shared/services/courses-rest.service";
import { StudentsRestService } from "src/app/shared/services/students-rest.service";
import { StudyClassesRestService } from "src/app/shared/services/study-classes-rest.service";
import { keyToNumber } from "src/app/shared/utils/drop-down-items";
import { TypeaheadComponent } from "../../../shared/components/typeahead/typeahead.component";
import { EvaluateAbsencesFilter } from "../../services/evaluate-absences-state.service";

@Component({
  selector: "bkd-evaluate-absences-header",
  templateUrl: "./evaluate-absences-header.component.html",
  styleUrls: ["./evaluate-absences-header.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TypeaheadComponent, TranslatePipe, DateSelectComponent],
})
export class EvaluateAbsencesHeaderComponent {
  protected readonly studentsService = inject(StudentsRestService);
  protected readonly coursesService = inject(CoursesRestService);
  protected readonly studyClassesService = inject(StudyClassesRestService);

  readonly filter = model<EvaluateAbsencesFilter>({
    student: null,
    course: null,
    studyClass: null,
    dateFrom: null,
    dateTo: null,
  });

  /**
   * The filter currently being edited. Changes stay local until they get
   * committed to `filter` by `show`, in order to not reload the entries
   * on every single change.
   */
  protected readonly intermediateFilter = linkedSignal(() => this.filter());

  protected readonly classesHttpFilter = {
    params: {
      fields: "IsActive",
      ["filter.IsActive"]: "=true",
    },
  };

  protected readonly keyToNumber = keyToNumber;

  onDateFromChange(date: Option<Date>) {
    this.intermediateFilter.update((current) => ({
      ...current,
      dateFrom: date,

      // Make sure the dates represent a valid range to avoid an always empty result
      dateTo:
        date && current.dateTo && isAfter(date, current.dateTo)
          ? date
          : current.dateTo,
    }));
  }

  onDateToChange(date: Option<Date>) {
    this.intermediateFilter.update((current) => ({
      ...current,
      dateTo: date,

      // Make sure the dates represent a valid range to avoid an always empty result
      dateFrom:
        date && current.dateFrom && isBefore(date, current.dateFrom)
          ? date
          : current.dateFrom,
    }));
  }

  protected patchFilter(patch: Partial<EvaluateAbsencesFilter>): void {
    this.intermediateFilter.update((current) => ({ ...current, ...patch }));
  }

  protected show(): void {
    const intermediateFilter = this.intermediateFilter();
    this.filter.set({
      ...intermediateFilter,

      // Normalize the dates' times to 00:00 to be comparable
      dateFrom: normalizeDate(intermediateFilter.dateFrom),
      dateTo: normalizeDate(intermediateFilter.dateTo),
    });
  }
}

function normalizeDate(date: Option<Date>): Option<Date> {
  return date ? startOfDay(date) : null;
}
