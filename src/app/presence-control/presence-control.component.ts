import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { map, shareReplay } from 'rxjs/operators';

import { LessonPresencesRestService } from '../shared/services/lesson-presences-rest.service';
import { Lesson } from '../shared/models/lesson.model';
import {
  LessonPresence,
  extractLesson
} from '../shared/models/lesson-presence.model';

@Component({
  selector: 'erz-presence-control',
  template: '<router-outlet></router-outlet>',
  styleUrls: ['./presence-control.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PresenceControlComponent implements OnInit {
  lessonPresences$ = this.lessPresencesService.getList().pipe(shareReplay(1));
  lesson$ = this.lessonPresences$.pipe(map(this.getLesson));

  constructor(private lessPresencesService: LessonPresencesRestService) {}

  ngOnInit(): void {}

  getLesson(lessonPresences: ReadonlyArray<LessonPresence>): Option<Lesson> {
    if (lessonPresences.length === 0) {
      return null;
    }
    return extractLesson(lessonPresences[0]);
  }
}
