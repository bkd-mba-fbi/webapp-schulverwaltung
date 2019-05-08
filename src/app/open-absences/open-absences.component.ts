import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

import { LessonAbsencesRestService } from '../shared/services/lesson-absences-rest.service';

@Component({
  selector: 'erz-open-absences',
  templateUrl: './open-absences.component.html',
  styleUrls: ['./open-absences.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OpenAbsencesComponent implements OnInit {
  lessonAbsences$ = this.lessonAbsencesService.getList();

  constructor(private lessonAbsencesService: LessonAbsencesRestService) {}

  ngOnInit(): void {}
}
