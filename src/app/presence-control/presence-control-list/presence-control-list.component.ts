import { Component, OnInit } from '@angular/core';
import { shareReplay, map } from 'rxjs/operators';
import { LessonPresencesRestService } from 'src/app/shared/services/lesson-presences-rest.service';
import {
  LessonPresence,
  extractLesson
} from 'src/app/shared/models/lesson-presence.model';
import { Lesson } from 'src/app/shared/models/lesson.model';

@Component({
  selector: 'erz-presence-control-list',
  templateUrl: './presence-control-list.component.html',
  styleUrls: ['./presence-control-list.component.scss']
})
export class PresenceControlListComponent implements OnInit {
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
