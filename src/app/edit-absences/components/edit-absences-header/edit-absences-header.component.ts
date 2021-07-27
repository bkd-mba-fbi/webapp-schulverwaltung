import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  OnInit,
  Output,
  Input,
} from '@angular/core';
import {
  NgbDateAdapter,
  NgbDateNativeAdapter,
  NgbDateParserFormatter,
} from '@ng-bootstrap/ng-bootstrap';
import { map } from 'rxjs/operators';
import { startOfDay } from 'date-fns';

import { not } from 'src/app/shared/utils/filter';
import {
  isComment,
  isIncident,
} from 'src/app/presence-control/utils/presence-types';
import { DateParserFormatter } from 'src/app/shared/services/date-parser-formatter';
import {
  addGroupToDropdownItem,
  createPresenceTypesDropdownItems,
  sortPresenceTypes,
} from 'src/app/shared/utils/presence-types';
import { EducationalEventsRestService } from '../../../shared/services/educational-events-rest.service';
import { StudentsRestService } from 'src/app/shared/services/students-rest.service';
import { StudyClassesRestService } from 'src/app/shared/services/study-classes-rest.service';
import {
  EditAbsencesFilter,
  EditAbsencesStateService,
} from '../../services/edit-absences-state.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'erz-edit-absences-header',
  templateUrl: './edit-absences-header.component.html',
  styleUrls: ['./edit-absences-header.component.scss'],
  providers: [
    { provide: NgbDateAdapter, useClass: NgbDateNativeAdapter },
    { provide: NgbDateParserFormatter, useClass: DateParserFormatter },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditAbsencesHeaderComponent implements OnInit {
  @Input()
  filter: EditAbsencesFilter = {
    student: null,
    educationalEvent: null,
    studyClass: null,
    dateFrom: null,
    dateTo: null,
    presenceTypes: null,
    confirmationStates: null,
    incidentTypes: null,
  };

  @Output() filterChange = new EventEmitter<EditAbsencesFilter>();

  absenceConfirmationStatesGrouped$ = this.state.absenceConfirmationStates$.pipe(
    map((i) =>
      addGroupToDropdownItem(
        i,
        this.translate.instant('shared.multiselect.all-option')
      )
    )
  );

  presenceTypesGrouped$ = this.state.presenceTypes$.pipe(
    map((presenceTypes) =>
      presenceTypes.filter(not(isComment)).filter(not(isIncident))
    ),
    map(sortPresenceTypes),
    map(createPresenceTypesDropdownItems),
    map((i) =>
      addGroupToDropdownItem(
        i,
        this.translate.instant('shared.multiselect.all-option')
      )
    )
  );

  incidentTypesGrouped$ = this.state.presenceTypes$.pipe(
    map((presenceTypes) => presenceTypes.filter(isIncident)),
    map(sortPresenceTypes),
    map(createPresenceTypesDropdownItems),
    map((i) =>
      addGroupToDropdownItem(
        i,
        this.translate.instant('shared.multiselect.all-option')
      )
    )
  );

  constructor(
    public studentsService: StudentsRestService,
    public educationalEventsService: EducationalEventsRestService,
    public studyClassService: StudyClassesRestService,
    private state: EditAbsencesStateService,
    private translate: TranslateService
  ) {}

  classesHttpFilter = {
    params: {
      fields: 'IsActive',
      ['filter.IsActive']: '=true',
    },
  };

  ngOnInit(): void {}

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
