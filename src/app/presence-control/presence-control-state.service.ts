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
  catchError
} from 'rxjs/operators';

import { LessonPresence } from '../shared/models/lesson-presence.model';
import { PresenceType } from '../shared/models/presence-type.model';
import { Lesson } from '../shared/models/lesson.model';
import { LessonPresencesRestService } from '../shared/services/lesson-presences-rest.service';
import { PresenceTypesRestService } from '../shared/services/presence-types-rest.service';
import {
  extractLessons,
  getCurrentLesson,
  lessonsEqual,
  getPresenceControlEntriesForLesson
} from './utils/lessons';
import { getCategoryCount } from './utils/presence-control-entries';
import {
  previousElement,
  nextElement,
  isFirstElement,
  isLastElement
} from '../shared/utils/array';
import { spreadTuple, spreadTriplet } from '../shared/utils/function';
import { nonZero } from '../shared/utils/filter';

export enum ViewMode {
  Grid = 'grid',
  List = 'list'
}

@Injectable({
  providedIn: 'root'
})
export class PresenceControlStateService {
  private selectedDateSubject$ = new BehaviorSubject(new Date());
  private selectLesson$ = new Subject<Option<Lesson>>();
  private loadingCount$ = new BehaviorSubject(0);
  private viewModeSubject$ = new BehaviorSubject(ViewMode.Grid);

  private lessonPresences$ = this.selectedDateSubject$.pipe(
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

  presentCount$ = this.selectedPresenceControlEntries$.pipe(
    map(getCategoryCount('present'))
  );
  absentCount$ = this.selectedPresenceControlEntries$.pipe(
    map(getCategoryCount('absent'))
  );
  lateCount$ = this.selectedPresenceControlEntries$.pipe(
    map(getCategoryCount('late'))
  );

  isFirstLesson$ = combineLatest(this.selectedLesson$, this.lessons$).pipe(
    map(spreadTuple(isFirstElement(lessonsEqual)))
  );
  isLastLesson$ = combineLatest(this.selectedLesson$, this.lessons$).pipe(
    map(spreadTuple(isLastElement(lessonsEqual)))
  );

  loading$ = this.loadingCount$.pipe(map(nonZero));

  viewMode$ = this.viewModeSubject$.asObservable();
  selectedDate$ = this.selectedDateSubject$.asObservable();

  constructor(
    private lessonPresencesService: LessonPresencesRestService,
    private presenceTypesService: PresenceTypesRestService
  ) {}

  setDate(date: Date): void {
    this.selectedDateSubject$.next(date);
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

  setViewMode(mode: ViewMode): void {
    this.viewModeSubject$.next(mode);
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
