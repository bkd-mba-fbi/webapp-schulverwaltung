import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  combineLatest,
  merge,
  Observable,
  Subject
} from 'rxjs';
import {
  map,
  shareReplay,
  switchMap,
  take,
  withLatestFrom
} from 'rxjs/operators';
import { LessonPresence } from '../shared/models/lesson-presence.model';
import { Lesson } from '../shared/models/lesson.model';
import { PresenceType } from '../shared/models/presence-type.model';
import { LessonPresencesRestService } from '../shared/services/lesson-presences-rest.service';
import { LoadingService } from '../shared/services/loading-service';
import { PresenceTypesRestService } from '../shared/services/presence-types-rest.service';
import {
  isFirstElement,
  isLastElement,
  nextElement,
  previousElement
} from '../shared/utils/array';
import { spreadTriplet, spreadTuple } from '../shared/utils/function';
import {
  extractLessons,
  getCurrentLesson,
  getPresenceControlEntriesForLesson,
  lessonsEqual
} from './utils/lessons';
import { getCategoryCount } from './utils/presence-control-entries';

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

  viewMode$ = this.viewModeSubject$.asObservable();
  selectedDate$ = this.selectedDateSubject$.asObservable();

  constructor(
    private lessonPresencesService: LessonPresencesRestService,
    private presenceTypesService: PresenceTypesRestService,
    public loadingService: LoadingService
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
    return this.loadingService.load(
      this.lessonPresencesService.getListByDate(date)
    );
  }

  private loadPresenceTypes(): Observable<ReadonlyArray<PresenceType>> {
    return this.loadingService.load(this.presenceTypesService.getList());
  }
}
