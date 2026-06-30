import {
  ChangeDetectionStrategy,
  Component,
  inject,
  model,
} from "@angular/core";
import {
  NgbDateAdapter,
  NgbDateNativeAdapter,
  NgbDateParserFormatter,
} from "@ng-bootstrap/ng-bootstrap";
import { TranslatePipe } from "@ngx-translate/core";
import { isAfter } from "date-fns/isAfter";
import { isBefore } from "date-fns/isBefore";
import { startOfDay } from "date-fns/startOfDay";
import { DateSelectComponent } from "src/app/shared/components/date-select/date-select.component";
import { CoursesRestService } from "src/app/shared/services/courses-rest.service";
import { DateParserFormatter } from "src/app/shared/services/date-parser-formatter";
import { StudentsRestService } from "src/app/shared/services/students-rest.service";
import { StudyClassesRestService } from "src/app/shared/services/study-classes-rest.service";
import { TypeaheadComponent } from "../../../shared/components/typeahead/typeahead.component";
import { EvaluateAbsencesFilter } from "../../services/evaluate-absences-state.service";

@Component({
  selector: "bkd-evaluate-absences-header",
  templateUrl: "./evaluate-absences-header.component.html",
  styleUrls: ["./evaluate-absences-header.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TypeaheadComponent, TranslatePipe, DateSelectComponent],
  providers: [
    { provide: NgbDateAdapter, useClass: NgbDateNativeAdapter },
    { provide: NgbDateParserFormatter, useClass: DateParserFormatter },
  ],
})
export class EvaluateAbsencesHeaderComponent {
  studentsService = inject(StudentsRestService);
  coursesService = inject(CoursesRestService);
  studyClassesService = inject(StudyClassesRestService);

  readonly filter = model<EvaluateAbsencesFilter>({
    student: null,
    course: null,
    studyClass: null,
    dateFrom: null,
    dateTo: null,
  });

  readonly classesHttpFilter = {
    params: {
      fields: "IsActive",
      ["filter.IsActive"]: "=true",
    },
  };

  onDateFromChange(date: Option<Date>) {
    this.filter.update((current) => ({
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
    this.filter.update((current) => ({
      ...current,
      dateTo: date,

      // Make sure the dates represent a valid range to avoid an always empty result
      dateFrom:
        date && current.dateFrom && isBefore(date, current.dateFrom)
          ? date
          : current.dateFrom,
    }));
  }

  show(): void {
    this.filter.update((current) => ({
      ...current,

      // Normalize the dates' times to 00:00 to be comparable
      dateFrom: normalizeDate(current.dateFrom),
      dateTo: normalizeDate(current.dateTo),
    }));
  }
}

function normalizeDate(date: Option<Date>): Option<Date> {
  return date ? startOfDay(date) : null;
}
