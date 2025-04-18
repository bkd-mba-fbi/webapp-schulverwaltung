import { AsyncPipe } from "@angular/common";
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
import { TranslatePipe, TranslateService } from "@ngx-translate/core";
import { startOfDay } from "date-fns";
import { map } from "rxjs/operators";
import {
  isComment,
  isIncident,
} from "src/app/presence-control/utils/presence-types";
import { DateParserFormatter } from "src/app/shared/services/date-parser-formatter";
import { StudentsRestService } from "src/app/shared/services/students-rest.service";
import { StudyClassesRestService } from "src/app/shared/services/study-classes-rest.service";
import { not } from "src/app/shared/utils/filter";
import {
  addGroupToDropdownItem,
  createPresenceTypesDropdownItems,
  sortPresenceTypes,
} from "src/app/shared/utils/presence-types";
import { DateSelectComponent } from "../../../shared/components/date-select/date-select.component";
import { MultiselectComponent } from "../../../shared/components/multiselect/multiselect.component";
import { TypeaheadComponent } from "../../../shared/components/typeahead/typeahead.component";
import { EducationalEventsRestService } from "../../../shared/services/educational-events-rest.service";
import { TeacherResourcesRestService } from "../../../shared/services/teacher-resources-rest.service";
import {
  EditAbsencesFilter,
  EditAbsencesStateService,
} from "../../services/edit-absences-state.service";

@Component({
  selector: "bkd-edit-absences-header",
  templateUrl: "./edit-absences-header.component.html",
  styleUrls: ["./edit-absences-header.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TypeaheadComponent,
    DateSelectComponent,
    MultiselectComponent,
    AsyncPipe,
    TranslatePipe,
  ],
  providers: [
    { provide: NgbDateAdapter, useClass: NgbDateNativeAdapter },
    { provide: NgbDateParserFormatter, useClass: DateParserFormatter },
  ],
})
export class EditAbsencesHeaderComponent {
  studentsService = inject(StudentsRestService);
  educationalEventsService = inject(EducationalEventsRestService);
  studyClassService = inject(StudyClassesRestService);
  teacherResourcesService = inject(TeacherResourcesRestService);
  private state = inject(EditAbsencesStateService);
  private translate = inject(TranslateService);

  @Input()
  filter: EditAbsencesFilter = {
    student: null,
    educationalEvent: null,
    studyClass: null,
    teacher: null,
    dateFrom: null,
    dateTo: null,
    weekdays: null,
    presenceTypes: null,
    confirmationStates: null,
    incidentTypes: null,
  };

  @Output() filterChange = new EventEmitter<EditAbsencesFilter>();

  weekdaysGrouped$ = this.state.weekdays$.pipe(
    map((weekdays) =>
      addGroupToDropdownItem(
        weekdays,
        this.translate.instant("shared.multiselect.all-option"),
      ),
    ),
  );

  absenceConfirmationStatesGrouped$ =
    this.state.absenceConfirmationStates$.pipe(
      map((i) =>
        addGroupToDropdownItem(
          i,
          this.translate.instant("shared.multiselect.all-option"),
        ),
      ),
    );

  presenceTypesGrouped$ = this.state.presenceTypes$.pipe(
    map((presenceTypes) =>
      presenceTypes.filter(not(isComment)).filter(not(isIncident)),
    ),
    map(sortPresenceTypes),
    map(createPresenceTypesDropdownItems),
    map((i) =>
      addGroupToDropdownItem(
        i,
        this.translate.instant("shared.multiselect.all-option"),
      ),
    ),
  );

  incidentTypesGrouped$ = this.state.presenceTypes$.pipe(
    map((presenceTypes) => presenceTypes.filter(isIncident)),
    map(sortPresenceTypes),
    map(createPresenceTypesDropdownItems),
    map((i) =>
      addGroupToDropdownItem(
        i,
        this.translate.instant("shared.multiselect.all-option"),
      ),
    ),
  );

  classesHttpFilter = {
    params: {
      fields: "IsActive",
      ["filter.IsActive"]: "=true",
    },
  };

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
