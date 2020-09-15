import { Injectable, Inject, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { Params } from '@angular/router';
import {
  BehaviorSubject,
  combineLatest,
  merge,
  Observable,
  Subject,
  timer,
} from 'rxjs';
import {
  map,
  shareReplay,
  switchMap,
  take,
  distinctUntilChanged,
  takeUntil,
} from 'rxjs/operators';
import { isEqual, uniq } from 'lodash-es';
import { format } from 'date-fns';

import { LessonPresence } from '../../shared/models/lesson-presence.model';
import { Lesson } from '../../shared/models/lesson.model';
import { PresenceType } from '../../shared/models/presence-type.model';
import { LessonPresencesRestService } from '../../shared/services/lesson-presences-rest.service';
import { LoadingService } from '../../shared/services/loading-service';
import { PresenceTypesService } from '../../shared/services/presence-types.service';
import { spread } from '../../shared/utils/function';
import {
  extractLessons,
  getCurrentLesson,
  getPresenceControlEntriesForLesson,
  lessonsEqual,
} from '../utils/lessons';
import { getCategoryCount } from '../utils/presence-control-entries';
import { updatePresenceTypeForPresences } from '../utils/lesson-presences';
import { PresenceControlEntry } from '../models/presence-control-entry.model';
import { LessonPresenceUpdate } from '../../shared/services/lesson-presences-update.service';
import { Settings, SETTINGS } from 'src/app/settings';
import { canChangePresenceType } from '../utils/presence-types';
import { isToday } from 'date-fns';
import { HttpParams } from '@angular/common/http';
import { IConfirmAbsencesService } from 'src/app/shared/tokens/confirm-absences-service';
import { DropDownItemsRestService } from '../../shared/services/drop-down-items-rest.service';

export enum ViewMode {
  Grid = 'grid',
  List = 'list',
}
export const VIEW_MODES: ReadonlyArray<string> = Object.keys(ViewMode).map(
  (k) => (ViewMode as any)[k]
);

@Injectable()
export class PresenceControlStateService
  implements OnDestroy, IConfirmAbsencesService {
  confirmBackLinkParams?: Params;

  private selectedDateSubject$ = new BehaviorSubject(new Date());
  private selectLesson$ = new Subject<Option<Lesson>>();
  private viewModeSubject$ = new BehaviorSubject(ViewMode.Grid);

  private updateLessonPresences$ = new Subject<ReadonlyArray<LessonPresence>>();

  private lessonPresences$ = merge(
    this.selectedDateSubject$.pipe(
      distinctUntilChanged(isEqual),
      switchMap(this.loadLessonPresencesByDate.bind(this))
    ),
    this.updateLessonPresences$
  ).pipe(shareReplay(1));
  private presenceTypes$ = this.loadPresenceTypes().pipe(shareReplay(1));

  lessons$ = this.lessonPresences$.pipe(map(extractLessons), shareReplay(1));
  private currentLesson$ = this.lessons$.pipe(
    map(getCurrentLesson),
    distinctUntilChanged(lessonsEqual)
  );

  studentIdsWithUnconfirmedAbsences$ = this.selectedDateSubject$.pipe(
    switchMap(() => this.loadStudentIdsWithUnconfirmedAbsences()),
    shareReplay(1)
  );

  loading$ = this.loadingService.loading$;

  selectedLesson$ = merge(this.currentLesson$, this.selectLesson$).pipe(
    shareReplay(1)
  );

  absenceConfirmationStates$ = this.dropDownItemsService
    .getAbsenceConfirmationStates()
    .pipe(shareReplay(1));

  selectedPresenceControlEntries$ = combineLatest([
    this.selectedLesson$,
    this.lessonPresences$,
    this.presenceTypes$,
    this.absenceConfirmationStates$,
  ]).pipe(
    map(spread(getPresenceControlEntriesForLesson)),
    shareReplay(1)
  );

  presentCount$ = this.selectedPresenceControlEntries$.pipe(
    map(getCategoryCount('present'))
  );
  absentCount$ = this.selectedPresenceControlEntries$.pipe(
    map(getCategoryCount('absent'))
  );
  checkableCount$ = this.selectedPresenceControlEntries$.pipe(
    map(getCategoryCount('checkable'))
  );

  viewMode$ = this.viewModeSubject$.asObservable();
  selectedDate$ = this.selectedDateSubject$.asObservable();

  queryParams$ = combineLatest([
    this.selectedDate$,
    this.selectedLesson$,
    this.viewMode$,
  ]).pipe(map(spread(this.buildQueryParams.bind(this))));

  private destroy$ = new Subject<void>();

  constructor(
    private lessonPresencesService: LessonPresencesRestService,
    private presenceTypesService: PresenceTypesService,
    private dropDownItemsService: DropDownItemsRestService,
    private loadingService: LoadingService,
    @Inject(SETTINGS) private settings: Settings,
    private location: Location
  ) {
    this.queryParams$.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.location.replaceState('/presence-control', params.toString());
      this.confirmBackLinkParams = { returnparams: params };
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  setDate(date: Date): void {
    this.selectedDateSubject$.next(date);
  }

  setLesson(lesson: Lesson): void {
    this.selectLesson$.next(lesson);
  }

  setViewMode(mode: ViewMode): void {
    this.viewModeSubject$.next(mode);
  }

  updateLessonPresencesTypes(
    updates: ReadonlyArray<LessonPresenceUpdate>
  ): void {
    combineLatest([
      this.lessonPresences$.pipe(take(1)),
      this.presenceTypes$.pipe(take(1)),
    ])
      .pipe(
        map(([lessonPresences, presenceTypes]) =>
          updatePresenceTypeForPresences(
            lessonPresences,
            updates,
            presenceTypes,
            this.settings
          )
        )
      )
      .subscribe((lessonPresences) =>
        this.updateLessonPresences$.next(lessonPresences)
      );
  }

  getNextPresenceType(
    entry: PresenceControlEntry
  ): Observable<Option<PresenceType>> {
    return this.presenceTypes$.pipe(
      take(1),
      map((presenceTypes) => entry.getNextPresenceType(presenceTypes))
    );
  }

  /**
   * Looks up presence control entry within current lesson.
   */
  getPresenceControlEntry(
    studentId: number,
    lessonId: number
  ): Observable<Option<PresenceControlEntry>> {
    return this.selectedPresenceControlEntries$.pipe(
      take(1),
      map(
        (entries) =>
          entries.find(
            (e) =>
              e.lessonPresence.StudentRef.Id === studentId &&
              e.lessonPresence.LessonRef.Id === lessonId
          ) || null
      )
    );
  }

  hasUnconfirmedAbsences(entry: PresenceControlEntry): Observable<boolean> {
    return this.studentIdsWithUnconfirmedAbsences$.pipe(
      map((ids) => ids.includes(entry.lessonPresence.StudentRef.Id))
    );
  }

  /**
   * Lesson presences for which the presence type cannot be updated are filtered from the list of block lesson presences
   */
  getBlockLessonPresences(
    entry: PresenceControlEntry
  ): Observable<ReadonlyArray<LessonPresence>> {
    return combineLatest([
      this.lessonPresences$.pipe(take(1)),
      this.presenceTypes$.pipe(take(1)),
    ]).pipe(
      map(([presences, types]) =>
        presences
          .filter(
            (presence) =>
              presence.EventRef.Id === entry.lessonPresence.EventRef.Id &&
              presence.StudentRef.Id === entry.lessonPresence.StudentRef.Id &&
              canChangePresenceType(
                presence,
                types.find((t) => t.Id === presence.TypeRef.Id) || null,
                this.settings
              )
          )
          .sort((a, b) =>
            a.LessonDateTimeFrom > b.LessonDateTimeFrom ? 1 : -1
          )
      )
    );
  }

  private loadLessonPresencesByDate(
    date: Date
  ): Observable<ReadonlyArray<LessonPresence>> {
    return this.loadingService.load(
      isToday(date)
        ? this.lessonPresencesService.getListForToday()
        : this.lessonPresencesService.getListByDate(date)
    );
  }

  private loadPresenceTypes(): Observable<ReadonlyArray<PresenceType>> {
    return this.loadingService.load(this.presenceTypesService.presenceTypes$);
  }

  /**
   * Starts polling the unconfirmed absences, returns an array with
   * student ids that have unconfirmed absences.
   */
  private loadStudentIdsWithUnconfirmedAbsences(): Observable<
    ReadonlyArray<number>
  > {
    return timer(
      0,
      // Only start polling if a refresh time is defined
      this.settings.unconfirmedAbsencesRefreshTime || undefined
    ).pipe(
      switchMap(() => this.lessonPresencesService.getListOfUnconfirmed()),
      map((unconfirmed) => uniq(unconfirmed.map((p) => p.StudentRef.Id)))
    );
  }

  private buildQueryParams(
    date: Date,
    lesson: Option<Lesson>,
    viewMode: ViewMode
  ): HttpParams {
    let params = new HttpParams({
      fromObject: {
        date: format(date, 'yyyy-MM-dd'),
        viewMode,
      },
    });
    if (lesson) {
      params = params.set('lesson', String(lesson.LessonRef.Id));
    }
    return params;
  }
}
