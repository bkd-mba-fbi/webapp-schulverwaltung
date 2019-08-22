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
import { DateParserFormatter } from 'src/app/shared/services/date-parser-formatter';
import { ModuleInstancesRestService } from 'src/app/shared/services/module-instances-rest.service';
import { StudentsRestService } from 'src/app/shared/services/students-rest.service';
import { StudyClassesRestService } from 'src/app/shared/services/study-classes-rest.service';
import { EditAbsencesFilter } from '../../services/edit-absences-state.service';

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
    reason: null,
    state: null
  };

  constructor(
    public studentsService: StudentsRestService,
    public moduleInstancesService: ModuleInstancesRestService,
    public studyClassService: StudyClassesRestService
  ) {}

  ngOnInit(): void {}

  show(): void {
    this.filterChange.emit(this.filter);
  }
}
