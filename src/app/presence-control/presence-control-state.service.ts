import { Injectable } from '@angular/core';
import {
  Observable,
  BehaviorSubject,
  Subject,
  merge,
  combineLatest,
  throwError
} from 'rxjs';
import {
  map,
  shareReplay,
  switchMap,
  take,
  withLatestFrom,
  tap,
  finalize,
  catchError
} from 'rxjs/operators';

import { LessonPresence } from '../shared/models/lesson-presence.model';
import { PresenceType } from '../shared/models/presence-type.model';
import { Lesson } from '../shared/models/lesson.model';
import { LessonPresencesRestService } from '../shared/services/lesson-presences-rest.service';
import { PresenceTypesService } from '../shared/services/presence-types.service';
import {
  extractLessons,
  getCurrentLesson,
  lessonsEqual,
  getPresenceControlEntriesForLesson
} from './utils/lessons';
import {
  previousElement,
  nextElement,
  isFirstElement,
  isLastElement
} from '../shared/utils/array';
import { spreadTuple, spreadTriplet } from '../shared/utils/function';
import { nonZero } from '../shared/utils/filter';

@Injectable({
  providedIn: 'root'
})
export class PresenceControlStateService {
  private date$ = new BehaviorSubject(new Date());
  private selectLesson$ = new Subject<Option<Lesson>>();
  private loadingCount$ = new BehaviorSubject(0);

  private lessonPresences$ = this.date$.pipe(
    switchMap(this.loadLessonPresencesByDate.bind(this)),
    shareReplay(1)
  );
  private presenceTypes$ = this.loadPresenceTypes().pipe(shareReplay(1));
  private lessons$ = this.lessonPresences$.pipe(
    map(extractLessons),
    shareReplay(1)
  );
  private currentLesson$ = this.lessons$.pipe(map(getCurrentLesson));

  selectedLesson$ = merge(this.currentLesson$, this.selectLesson$).pipe(
    shareReplay(1)
  );
  selectedPresenceControlEntries$ = combineLatest(
    this.selectedLesson$,
    this.lessonPresences$,
    this.presenceTypes$
  ).pipe(map(spreadTriplet(getPresenceControlEntriesForLesson)));

  isFirstLesson$ = combineLatest(this.selectedLesson$, this.lessons$).pipe(
    map(spreadTuple(isFirstElement(lessonsEqual)))
  );
  isLastLesson$ = combineLatest(this.selectedLesson$, this.lessons$).pipe(
    map(spreadTuple(isLastElement(lessonsEqual)))
  );

  loading$ = this.loadingCount$.pipe(map(nonZero));

  constructor(
    private lessonPresencesService: LessonPresencesRestService,
    private presenceTypesService: PresenceTypesService
  ) {}

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
    return this.load(this.lessonPresencesService.getListByDate(date));
  }

  private loadPresenceTypes(): Observable<ReadonlyArray<PresenceType>> {
    return this.load(this.presenceTypesService.getList());
  }

  private load<T>(source$: Observable<T>): Observable<T> {
    this.incrementLoadingCount();
    return source$.pipe(
      tap(() => this.decrementLoadingCount()),
      catchError(error => {
        this.decrementLoadingCount();
        return throwError(error);
      })
    );
  }

  private incrementLoadingCount(): void {
    this.loadingCount$.next(this.loadingCount$.value + 1);
  }

  private decrementLoadingCount(): void {
    this.loadingCount$.next(Math.max(this.loadingCount$.value - 1, 0));
  }
}
