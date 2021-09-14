import { Location } from '@angular/common';
import { Inject, Injectable, OnDestroy } from '@angular/core';
import { Params } from '@angular/router';
import { format, isToday } from 'date-fns';
import { isEqual, uniq } from 'lodash-es';
import {
  BehaviorSubject,
  combineLatest,
  merge,
  Observable,
  Subject,
  timer,
} from 'rxjs';
import {
  defaultIfEmpty,
  distinctUntilChanged,
  filter,
  map,
  mergeAll,
  shareReplay,
  startWith,
  switchMap,
  take,
  takeUntil,
} from 'rxjs/operators';
import { Settings, SETTINGS } from 'src/app/settings';
import {
  BaseProperty,
  UserSetting,
  ViewModeType,
} from 'src/app/shared/models/user-setting.model';
import { UserSettingsRestService } from 'src/app/shared/services/user-settings-rest.service';
import { IConfirmAbsencesService } from 'src/app/shared/tokens/confirm-absences-service';
import { decode } from 'src/app/shared/utils/decode';
import { serializeParams } from 'src/app/shared/utils/url';
import { buildUserSetting } from 'src/spec-builders';
import { LessonPresence } from '../../shared/models/lesson-presence.model';
import { PresenceType } from '../../shared/models/presence-type.model';
import { DropDownItemsRestService } from '../../shared/services/drop-down-items-rest.service';
import { LessonPresencesRestService } from '../../shared/services/lesson-presences-rest.service';
import { LessonPresenceUpdate } from '../../shared/services/lesson-presences-update.service';
import { LessonTeachersRestService } from '../../shared/services/lesson-teachers-rest.service';
import { LoadingService } from '../../shared/services/loading-service';
import { PersonsRestService } from '../../shared/services/persons-rest.service';
import { PresenceTypesService } from '../../shared/services/presence-types.service';
import { spread } from '../../shared/utils/function';
import { filterByGroup } from '../../shared/utils/presence-control-entries';
import { LessonEntry, lessonsEntryEqual } from '../models/lesson-entry.model';
import { PresenceControlEntry } from '../models/presence-control-entry.model';
import {
  extractLessonEntries,
  getCurrentLessonEntry,
} from '../utils/lesson-entries';
import { updatePresenceTypeForPresences } from '../utils/lesson-presences';
import { getPresenceControlEntriesForLesson } from '../utils/lessons';
import {
  getCategoryCount,
  getPrecedingAbsencesCount,
} from '../utils/presence-control-entries';
import { canChangePresenceType } from '../utils/presence-types';
import { PresenceControlGroupService } from './presence-control-group.service';

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
  private selectLesson$ = new Subject<Option<LessonEntry>>();
  private viewModeSubject$ = new Subject<ViewMode>();
  private updateLessonPresences$ = new Subject<ReadonlyArray<LessonPresence>>();

  private lessonPresences$ = merge(
    this.selectedDateSubject$.pipe(
      distinctUntilChanged(isEqual),
      switchMap(this.loadLessonPresencesByDate.bind(this))
    ),
    this.updateLessonPresences$
  ).pipe(shareReplay(1));
  private presenceTypes$ = this.loadPresenceTypes().pipe(shareReplay(1));

  lessons$ = this.lessonPresences$.pipe(
    map(extractLessonEntries),
    shareReplay(1)
  );
  private currentLesson$ = this.lessons$.pipe(
    map(getCurrentLessonEntry),
    distinctUntilChanged(lessonsEntryEqual)
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

  selectedLessonStudentIds$ = combineLatest([
    this.selectLesson$,
    this.lessonPresences$,
  ]).pipe(
    map(([lesson, presences]) => {
      return presences.filter((i) => i.LessonRef.Id === Number(lesson?.id));
    }),
    map((p) => p.map((i) => i.StudentRef.Id)),
    shareReplay(1)
  );

  otherTeachersAbsences$ = combineLatest([
    this.personsService.getMyself(),
    this.selectedLessonStudentIds$.pipe(startWith([])),
  ]).pipe(
    switchMap(([person, students]) =>
      this.lessonTeacherService.loadOtherTeachersLessonAbsences(
        person.Id,
        students
      )
    ),
    shareReplay(1)
  );

  groupsAvailability$ = this.groupService.groupsAvailability$;

  selectedPresenceControlEntries$ = combineLatest([
    this.selectedLesson$,
    this.lessonPresences$,
    this.presenceTypes$,
    this.absenceConfirmationStates$,
    this.otherTeachersAbsences$,
  ]).pipe(map(spread(getPresenceControlEntriesForLesson)));

  selectedPresenceControlEntriesByGroup$ = combineLatest([
    this.groupService.group$,
    this.selectedPresenceControlEntries$,
    this.groupService.subscriptionDetailPersonIds$,
  ]).pipe(map(spread(filterByGroup)), shareReplay(1));

  presentCount$ = this.selectedPresenceControlEntriesByGroup$.pipe(
    map(getCategoryCount('present'))
  );
  absentCount$ = this.selectedPresenceControlEntriesByGroup$.pipe(
    map(getCategoryCount('absent'))
  );
  unapprovedCount$ = this.selectedPresenceControlEntriesByGroup$.pipe(
    map(getCategoryCount('unapproved'))
  );
  absentPrecedingCount$ = this.selectedPresenceControlEntriesByGroup$.pipe(
    map(getPrecedingAbsencesCount())
  );

  viewMode$ = merge(
    this.viewModeSubject$,
    this.getSavedViewMode().pipe(take(1), defaultIfEmpty(ViewMode.Grid))
  );
  selectedDate$ = this.selectedDateSubject$.asObservable();

  queryParamsString$ = combineLatest([
    this.selectedDate$,
    this.selectedLesson$,
    this.viewMode$,
  ]).pipe(map(spread(this.buildQueryParams.bind(this))), map(serializeParams));

  private destroy$ = new Subject<void>();

  constructor(
    private settingsService: UserSettingsRestService,
    private lessonPresencesService: LessonPresencesRestService,
    private lessonTeacherService: LessonTeachersRestService,
    private presenceTypesService: PresenceTypesService,
    private personsService: PersonsRestService,
    private groupService: PresenceControlGroupService,
    private dropDownItemsService: DropDownItemsRestService,
    private loadingService: LoadingService,
    @Inject(SETTINGS) private settings: Settings,
    private location: Location
  ) {
    this.queryParamsString$
      .pipe(takeUntil(this.destroy$))
      .subscribe((returnparams) => {
        this.location.replaceState('/presence-control', returnparams);
        this.confirmBackLinkParams = { returnparams };
      });

    this.viewModeSubject$
      .pipe(
        takeUntil(this.destroy$),
        distinctUntilChanged(),
        switchMap((v) => this.updateSavedViewMode(v))
      )
      .subscribe();

    this.selectedLesson$
      .pipe(takeUntil(this.destroy$))
      .subscribe((lesson) => this.groupService.setSelectedLesson(lesson));

    this.lessonPresences$
      .pipe(takeUntil(this.destroy$))
      .subscribe((presences) =>
        this.groupService.setLessonPresences(presences)
      );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  setDate(date: Date): void {
    this.selectedDateSubject$.next(date);
  }

  setLesson(lesson: LessonEntry): void {
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

  hasUnconfirmedAbsences(entry: PresenceControlEntry): Observable<boolean> {
    return this.studentIdsWithUnconfirmedAbsences$.pipe(
      map((ids) => ids.includes(entry.lessonPresence.StudentRef.Id))
    );
  }

  /**
   * Block lesson presences are defined as a set of lesson presences on the same day, with the same teacher and not more than half an hour apart
   *
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
              presence.TeacherInformation ===
                entry.lessonPresence.TeacherInformation &&
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
          .reduce((blockLessons, presence) => {
            const previousPresence = blockLessons[blockLessons.length - 1];
            if (this.isPartOfBlock(presence, previousPresence)) {
              blockLessons.push(presence);
              return blockLessons;
            } else {
              return blockLessons.find(
                (bl) => bl.Id === entry.lessonPresence.Id
              )
                ? blockLessons
                : [presence];
            }
          }, [] as Array<LessonPresence>)
      )
    );
  }

  /**
   * Lesson presences that are apart half an hour or less are considered as part of a block
   */
  private isPartOfBlock(
    presence: LessonPresence,
    previousPresence: LessonPresence
  ): boolean {
    if (!previousPresence) {
      return true;
    }

    return (
      presence.LessonDateTimeFrom.getTime() -
        previousPresence.LessonDateTimeTo.getTime() <=
      30 * 60 * 1000
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
    lessonEntry: Option<LessonEntry>,
    viewMode: ViewMode
  ): Params {
    const params: Params = {
      date: format(date, 'yyyy-MM-dd'),
      viewMode,
    };
    if (lessonEntry) {
      params.lesson = String(lessonEntry.id);
    }
    return params;
  }

  private getSavedViewMode(): Observable<ViewMode> {
    return this.settingsService.getUserSettingsCst().pipe(
      map<UserSetting, BaseProperty[]>((i) => i.Settings),
      mergeAll(),
      filter((i) => i.Key === 'presenceControlViewMode'),
      take(1),
      map((v) => JSON.parse(v.Value)),
      switchMap(decode(ViewModeType)),
      map((v) => this.getViewModeForString(v.presenceControl)),
      shareReplay()
    );
  }

  private getViewModeForString(viewMode: string): ViewMode {
    if (viewMode === ViewMode.List) {
      return ViewMode.List;
    } else {
      return ViewMode.Grid;
    }
  }

  private updateSavedViewMode(viewMode: ViewMode): Observable<any> {
    const propertyBody: ViewModeType = {
      presenceControl: viewMode,
    };
    const body: BaseProperty = {
      Key: 'presenceControlViewMode',
      Value: JSON.stringify(propertyBody),
    };
    const cst = Object.assign({}, buildUserSetting());
    cst.Settings.push(body);
    return this.settingsService.updateUserSettingsCst(cst);
  }
}
