import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
  Input,
} from '@angular/core';

import { StudentsRestService } from 'src/app/shared/services/students-rest.service';
import { EducationalEventsRestService } from '../../../shared/services/educational-events-rest.service';
import { StudyClassesRestService } from 'src/app/shared/services/study-classes-rest.service';
import { EvaluateAbsencesFilter } from '../../services/evaluate-absences-state.service';

@Component({
  selector: 'erz-evaluate-absences-header',
  templateUrl: './evaluate-absences-header.component.html',
  styleUrls: ['./evaluate-absences-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EvaluateAbsencesHeaderComponent implements OnInit {
  @Input()
  filter: EvaluateAbsencesFilter = {
    student: null,
    educationalEvent: null,
    studyClass: null,
  };

  @Output() filterChange = new EventEmitter<EvaluateAbsencesFilter>();

  constructor(
    public studentsService: StudentsRestService,
    public educationalEventsService: EducationalEventsRestService,
    public studyClassesService: StudyClassesRestService
  ) {}

  ngOnInit(): void {}

  show(): void {
    this.filterChange.emit(this.filter);
  }
}
