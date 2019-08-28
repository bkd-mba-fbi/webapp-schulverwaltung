import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
  Input
} from '@angular/core';

import { StudentsRestService } from 'src/app/shared/services/students-rest.service';
import { ModuleInstancesRestService } from 'src/app/shared/services/module-instances-rest.service';
import { StudyClassesRestService } from 'src/app/shared/services/study-classes-rest.service';
import { EvaluateAbsencesFilter } from '../../services/evaluate-absences-state.service';

@Component({
  selector: 'erz-evaluate-absences-header',
  templateUrl: './evaluate-absences-header.component.html',
  styleUrls: ['./evaluate-absences-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EvaluateAbsencesHeaderComponent implements OnInit {
  @Output() filterChange = new EventEmitter<EvaluateAbsencesFilter>();

  @Input()
  filter: EvaluateAbsencesFilter = {
    student: null,
    moduleInstance: null,
    studyClass: null
  };

  constructor(
    public studentsService: StudentsRestService,
    public moduleInstancesService: ModuleInstancesRestService,
    public studyClassesService: StudyClassesRestService
  ) {}

  ngOnInit(): void {}

  show(): void {
    this.filterChange.emit(this.filter);
  }
}
