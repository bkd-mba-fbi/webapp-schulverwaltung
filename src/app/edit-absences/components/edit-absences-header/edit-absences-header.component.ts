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
import { createPresenceTypesDropdownItems } from 'src/app/shared/utils/presence-types';
import { EducationalEventsRestService } from '../../../shared/services/educational-events-rest.service';
import { StudentsRestService } from 'src/app/shared/services/students-rest.service';
import { StudyClassesRestService } from 'src/app/shared/services/study-classes-rest.service';
import {
  EditAbsencesFilter,
  EditAbsencesStateService,
} from '../../services/edit-absences-state.service';

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
    presenceType: null,
    confirmationState: null,
    incidentType: null,
  };

  @Output() filterChange = new EventEmitter<EditAbsencesFilter>();

  absenceConfirmationStates$ = this.state.absenceConfirmationStates$;

  presenceTypes$ = this.state.presenceTypes$.pipe(
    map((presenceTypes) =>
      presenceTypes.filter(not(isComment)).filter(not(isIncident))
    ),
    map(createPresenceTypesDropdownItems)
  );

  incidentTypes$ = this.state.presenceTypes$.pipe(
    map((presenceTypes) => presenceTypes.filter(isIncident)),
    map(createPresenceTypesDropdownItems)
  );

  constructor(
    public studentsService: StudentsRestService,
    public educationalEventsService: EducationalEventsRestService,
    public studyClassService: StudyClassesRestService,
    private state: EditAbsencesStateService
  ) {}

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
