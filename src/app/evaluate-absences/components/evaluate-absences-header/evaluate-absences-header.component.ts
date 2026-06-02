import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  inject,
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
import { DateParserFormatter } from "src/app/shared/services/date-parser-formatter";
import { StudentsRestService } from "src/app/shared/services/students-rest.service";
import { StudyClassesRestService } from "src/app/shared/services/study-classes-rest.service";
import { TypeaheadComponent } from "../../../shared/components/typeahead/typeahead.component";
import { EducationalEventsRestService } from "../../../shared/services/educational-events-rest.service";
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
  educationalEventsService = inject(EducationalEventsRestService);
  studyClassesService = inject(StudyClassesRestService);

  @Input()
  filter: EvaluateAbsencesFilter = {
    student: null,
    educationalEvent: null,
    studyClass: null,
    dateFrom: null,
    dateTo: null,
  };

  @Output() filterChange = new EventEmitter<EvaluateAbsencesFilter>();

  classesHttpFilter = {
    params: {
      fields: "IsActive",
      ["filter.IsActive"]: "=true",
    },
  };

  onDateFromChange(date: Date | null) {
    this.filter.dateFrom = date;

    // Make sure the dates represent a valid range to avoid an always empty result
    if (date && this.filter.dateTo && isAfter(date, this.filter.dateTo)) {
      this.filter.dateTo = date;
    }
  }

  onDateToChange(date: Date | null) {
    this.filter.dateTo = date;

    // Make sure the dates represent a valid range to avoid an always empty result
    if (date && this.filter.dateFrom && isBefore(date, this.filter.dateFrom)) {
      this.filter.dateFrom = date;
    }
  }

  show(): void {
    this.filterChange.emit({
      ...this.filter,

      // Normalize the dates' times to 00:00 to be comparable
      dateFrom: normalizeDate(this.filter.dateFrom),
      dateTo: normalizeDate(this.filter.dateTo),
    });
  }
}

function normalizeDate(date: Option<Date>): Option<Date> {
  return date ? startOfDay(date) : null;
}
