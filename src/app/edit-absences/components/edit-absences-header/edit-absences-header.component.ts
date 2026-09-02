import { AsyncPipe } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  linkedSignal,
  model,
} from "@angular/core";
import { TranslatePipe, TranslateService } from "@ngx-translate/core";
import { startOfDay } from "date-fns";
import { map } from "rxjs/operators";
import {
  isComment,
  isIncident,
} from "src/app/presence-control/utils/presence-types";
import { CoursesRestService } from "src/app/shared/services/courses-rest.service";
import { StudentsRestService } from "src/app/shared/services/students-rest.service";
import { StudyClassesRestService } from "src/app/shared/services/study-classes-rest.service";
import {
  keyToNumber,
  keyToString,
  keysToNumbers,
  keysToStrings,
} from "src/app/shared/utils/drop-down-items";
import { not } from "src/app/shared/utils/filter";
import {
  addGroupToDropdownItem,
  createPresenceTypesDropdownItems,
  sortPresenceTypes,
} from "src/app/shared/utils/presence-types";
import { DateSelectComponent } from "../../../shared/components/date-select/date-select.component";
import { MultiselectComponent } from "../../../shared/components/multiselect/multiselect.component";
import { TypeaheadComponent } from "../../../shared/components/typeahead/typeahead.component";
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
})
export class EditAbsencesHeaderComponent {
  protected readonly studentsService = inject(StudentsRestService);
  protected readonly coursesService = inject(CoursesRestService);
  protected readonly studyClassService = inject(StudyClassesRestService);
  protected readonly teacherResourcesService = inject(
    TeacherResourcesRestService,
  );
  private readonly state = inject(EditAbsencesStateService);
  private readonly translate = inject(TranslateService);

  readonly filter = model<EditAbsencesFilter>({
    student: null,
    course: null,
    studyClass: null,
    teacher: null,
    dateFrom: null,
    dateTo: null,
    weekdays: null,
    presenceTypes: null,
    confirmationStates: null,
    incidentTypes: null,
  });

  /**
   * The filter currently being edited. Changes stay local until they get
   * committed to `filter` by `show`, in order to not reload the entries
   * on every single change.
   */
  protected readonly intermediateFilter = linkedSignal(() => this.filter());

  protected readonly weekdaysGrouped$ = this.state.weekdays$.pipe(
    map((weekdays) =>
      addGroupToDropdownItem(
        weekdays,
        this.translate.instant("shared.multiselect.all-option"),
      ),
    ),
  );

  protected readonly absenceConfirmationStatesGrouped$ =
    this.state.absenceConfirmationStates$.pipe(
      map((i) =>
        addGroupToDropdownItem(
          i,
          this.translate.instant("shared.multiselect.all-option"),
        ),
      ),
    );

  protected readonly presenceTypesGrouped$ = this.state.presenceTypes$.pipe(
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

  protected readonly incidentTypesGrouped$ = this.state.presenceTypes$.pipe(
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

  protected readonly classesHttpFilter = {
    params: {
      fields: "IsActive",
      ["filter.IsActive"]: "=true",
    },
  };

  protected readonly keyToNumber = keyToNumber;
  protected readonly keysToNumbers = keysToNumbers;
  protected readonly keyToString = keyToString;
  protected readonly keysToStrings = keysToStrings;

  onDateFromChange(date: Option<Date>) {
    this.intermediateFilter.update((current) => ({
      ...current,
      dateFrom: date,

      // Make sure both date fields have a value
      dateTo: current.dateTo ? current.dateTo : date,
    }));
  }

  onDateToChange(date: Option<Date>) {
    this.intermediateFilter.update((current) => ({
      ...current,
      dateTo: date,

      // Make sure both date fields have a value
      dateFrom: current.dateFrom ? current.dateFrom : date,
    }));
  }

  protected patchFilter(patch: Partial<EditAbsencesFilter>): void {
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
