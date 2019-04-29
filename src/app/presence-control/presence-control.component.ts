import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { LessonPresencesRestService } from '../shared/services/lesson-presences-rest.service.ts.service';

@Component({
  selector: 'erz-presence-control',
  templateUrl: './presence-control.component.html',
  styleUrls: ['./presence-control.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PresenceControlComponent implements OnInit {
  lessonPresences$ = this.lessPresencesService.getList();

  constructor(private lessPresencesService: LessonPresencesRestService) {}

  ngOnInit(): void {}
}
