import { Injectable } from '@angular/core';
import {
  Observable,
  BehaviorSubject,
  Subject,
  merge,
  combineLatest
} from 'rxjs';
import {
  map,
  shareReplay,
  switchMap,
  take,
  withLatestFrom
} from 'rxjs/operators';

import { LessonPresence } from '../shared/models/lesson-presence.model';
import { LessonPresencesRestService } from '../shared/services/lesson-presences-rest.service';
import { Lesson } from '../shared/models/lesson.model';
import {
  extractLessons,
  getCurrentLesson,
  getLessonPresencesForLesson,
  lessonsEqual
} from './utils/lessons';
import {
  previousElement,
  nextElement,
  isFirstElement,
  isLastElement
} from '../shared/utils/array';
import { spreadTuple } from '../shared/utils/function';

@Injectable({
  providedIn: 'root'
})
export class PresenceControlStateService {
  private date$ = new BehaviorSubject(new Date());
  private selectLesson$ = new Subject<Option<Lesson>>();

  private lessonPresences$ = this.date$.pipe(
    switchMap(this.loadLessonPresencesByDate.bind(this)),
    shareReplay(1)
  );
  private lessons$ = this.lessonPresences$.pipe(
    map(extractLessons),
    shareReplay(1)
  );
  private currentLesson$ = this.lessons$.pipe(map(getCurrentLesson));

  selectedLesson$ = merge(this.currentLesson$, this.selectLesson$).pipe(
    shareReplay(1)
  );
  selectedLessonPresences$ = combineLatest(
    this.selectedLesson$,
    this.lessonPresences$
  ).pipe(map(spreadTuple(getLessonPresencesForLesson)));
  isFirstLesson$ = combineLatest(this.selectedLesson$, this.lessons$).pipe(
    map(spreadTuple(isFirstElement(lessonsEqual)))
  );
  isLastLesson$ = combineLatest(this.selectedLesson$, this.lessons$).pipe(
    map(spreadTuple(isLastElement(lessonsEqual)))
  );

  constructor(private lessonPresencesService: LessonPresencesRestService) {}

  setDate(date: Date): void {
    this.date$.next(date);
  }

  previousLesson(): void {
    this.selectedLesson$
      .pipe(
        take(1),
        withLatestFrom(this.lessons$),
        map(spreadTuple(previousElement(lessonsEqual)))
      )
      .subscribe(lesson => this.selectLesson$.next(lesson));
  }

  nextLesson(): void {
    this.selectedLesson$
      .pipe(
        take(1),
        withLatestFrom(this.lessons$),
        map(spreadTuple(nextElement(lessonsEqual)))
      )
      .subscribe(lesson => this.selectLesson$.next(lesson));
  }

  private loadLessonPresencesByDate(
    date: Date
  ): Observable<ReadonlyArray<LessonPresence>> {
    return this.lessonPresencesService.getListByDate(date);
  }
}
