import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  OnInit,
  Output
} from '@angular/core';
import {
  NgbDateAdapter,
  NgbDateNativeAdapter,
  NgbDateParserFormatter
} from '@ng-bootstrap/ng-bootstrap';
import { shareReplay, map } from 'rxjs/operators';

import { DateParserFormatter } from 'src/app/shared/services/date-parser-formatter';
import { createPresenceTypesDropdownItems } from 'src/app/shared/utils/presence-types';
import { ModuleInstancesRestService } from 'src/app/shared/services/module-instances-rest.service';
import { StudentsRestService } from 'src/app/shared/services/students-rest.service';
import { StudyClassesRestService } from 'src/app/shared/services/study-classes-rest.service';
import { DropDownItemsRestService } from 'src/app/shared/services/drop-down-items-rest.service';
import {
  EditAbsencesFilter,
  EditAbsencesStateService
} from '../../services/edit-absences-state.service';

@Component({
  selector: 'erz-edit-absences-header',
  templateUrl: './edit-absences-header.component.html',
  styleUrls: ['./edit-absences-header.component.scss'],
  providers: [
    { provide: NgbDateAdapter, useClass: NgbDateNativeAdapter },
    { provide: NgbDateParserFormatter, useClass: DateParserFormatter }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditAbsencesHeaderComponent implements OnInit {
  @Output() filterChange = new EventEmitter<EditAbsencesFilter>();

  filter: EditAbsencesFilter = {
    student: null,
    moduleInstance: null,
    studyClass: null,
    dateFrom: null,
    dateTo: null,
    presenceType: null,
    confirmationState: null
  };

  absenceConfirmationStates$ = this.state.absenceConfirmationStates$;

  presenceTypes$ = this.state.presenceTypes$.pipe(
    map(createPresenceTypesDropdownItems)
  );

  constructor(
    public studentsService: StudentsRestService,
    public moduleInstancesService: ModuleInstancesRestService,
    public studyClassService: StudyClassesRestService,
    private state: EditAbsencesStateService
  ) {}

  ngOnInit(): void {}

  show(): void {
    this.filterChange.emit(this.filter);
  }
}
