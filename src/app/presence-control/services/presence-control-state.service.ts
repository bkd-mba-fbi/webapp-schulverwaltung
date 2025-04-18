import { Location } from "@angular/common";
import { Injectable, OnDestroy, inject } from "@angular/core";
import { Params } from "@angular/router";
import { format, isToday, startOfDay } from "date-fns";
import { isEqual, uniq } from "lodash-es";
import {
  BehaviorSubject,
  Observable,
  Subject,
  combineLatest,
  merge,
  of,
  timer,
} from "rxjs";
import {
  distinctUntilChanged,
  filter,
  map,
  shareReplay,
  skip,
  switchMap,
  take,
  takeUntil,
} from "rxjs/operators";
import { SETTINGS, Settings } from "src/app/settings";
import { PresenceControlViewMode } from "src/app/shared/models/user-settings.model";
import { UserSettingsService } from "src/app/shared/services/user-settings.service";
import { IConfirmAbsencesService } from "src/app/shared/tokens/confirm-absences-service";
import {
  intervalOnInactivity,
  reemitOnTrigger,
  withReload,
} from "src/app/shared/utils/observable";
import { serializeParams } from "src/app/shared/utils/url";
import { LessonPresence } from "../../shared/models/lesson-presence.model";
import { PresenceType } from "../../shared/models/presence-type.model";
import { DropDownItemsRestService } from "../../shared/services/drop-down-items-rest.service";
import { LessonPresencesRestService } from "../../shared/services/lesson-presences-rest.service";
import { LessonPresenceUpdate } from "../../shared/services/lesson-presences-update.service";
import { LessonTeachersRestService } from "../../shared/services/lesson-teachers-rest.service";
import { LoadingService } from "../../shared/services/loading-service";
import { PresenceTypesService } from "../../shared/services/presence-types.service";
import { StorageService } from "../../shared/services/storage.service";
import { spread } from "../../shared/utils/function";
import { filterByGroup } from "../../shared/utils/presence-control-entries";
import { LessonEntry } from "../models/lesson-entry.model";
import { PresenceControlEntry } from "../models/presence-control-entry.model";
import {
  getCurrentLessonEntry,
  getLessonEntriesForLessons,
} from "../utils/lesson-entries";
import { updatePresenceTypeForPresences } from "../utils/lesson-presences";
import { getPresenceControlEntriesForLesson } from "../utils/lessons";
import {
  getCategoryCount,
  getPrecedingAbsencesCount,
} from "../utils/presence-control-entries";
import { PresenceControlGroupService } from "./presence-control-group.service";

export const VIEW_MODES: ReadonlyArray<string> = Object.values(
  PresenceControlViewMode,
);

@Injectable()
export class PresenceControlStateService
  implements OnDestroy, IConfirmAbsencesService
{
  private userSettings = inject(UserSettingsService);
  private lessonPresencesService = inject(LessonPresencesRestService);
  private lessonTeacherService = inject(LessonTeachersRestService);
  private presenceTypesService = inject(PresenceTypesService);
  private groupService = inject(PresenceControlGroupService);
  private dropDownItemsService = inject(DropDownItemsRestService);
  private loadingService = inject(LoadingService);
  private storageService = inject(StorageService);
  private settings = inject<Settings>(SETTINGS);
  private location = inject(Location);

  confirmBackLinkParams?: Params;

  private selectedDateSubject$ = new BehaviorSubject(new Date());
  selectedDate$ = this.selectedDateSubject$.asObservable().pipe(
    map((date) => startOfDay(date)),
    distinctUntilChanged(isEqual),
  );

  private viewModeSubject$ = new Subject<PresenceControlViewMode>();
  viewMode$ = merge(
    this.viewModeSubject$,
    this.userSettings.getPresenceControlViewMode().pipe(take(1)),
  );

  lessons$ = this.selectedDate$.pipe(
    switchMap((date) => this.loadLessonsByDate(date)),
    shareReplay(1),
  );
  private selectLessonId$ = new Subject<number | string | undefined>();
  private selectLesson$ = this.selectLessonId$.pipe(
    switchMap((id) => this.getLessonById(id)),
  );
  selectedLesson$ = combineLatest([
    reemitOnTrigger(
      this.selectLesson$.pipe(distinctUntilChanged((a, b) => isEqual(a, b))),
      intervalOnInactivity(this.settings.lessonPresencesRefreshTime), // Trigger lesson reloading after periods of inactivity
    ),
    this.lessons$,
  ]).pipe(
    map(([selectedLesson, lessons]) =>
      // Reset selection if day changed
      lessons.find((l) => l.id === selectedLesson.id) ? selectedLesson : null,
    ),
    shareReplay(1),
  );

  studyClassCount$ = this.selectedLesson$.pipe(
    map((entry) => entry?.lessons.length || 0),
  );

  private updateLessonPresences$ = new Subject<ReadonlyArray<LessonPresence>>();
  private reloadLessonPresences$ = new Subject<void>();
  private lessonPresences$ = merge(
    withReload(this.selectedLesson$, this.reloadLessonPresences$).pipe(
      switchMap((lesson) =>
        lesson ? this.loadLessonPresencesByLesson(lesson) : of([]),
      ),
    ),
    this.updateLessonPresences$,
  ).pipe(shareReplay(1));

  presenceTypes$ = this.loadPresenceTypes().pipe(shareReplay(1));

  private reloadStudentIdsWithUnconfirmedAbsences$ = new Subject<void>();
  studentIdsWithUnconfirmedAbsences$ = merge(
    this.selectedDate$,
    this.selectedLesson$.pipe(skip(1)),
    this.reloadStudentIdsWithUnconfirmedAbsences$,
  ).pipe(
    switchMap(() => this.loadStudentIdsWithUnconfirmedAbsences()),
    shareReplay(1),
  );

  loading$ = this.loadingService.loading$;

  absenceConfirmationStates$ = this.dropDownItemsService
    .getAbsenceConfirmationStates()
    .pipe(shareReplay(1));

  private studentIds$ = this.lessonPresences$.pipe(
    map((p) => uniq(p.map((i) => i.StudentRef.Id))),
    shareReplay(1),
  );

  otherTeachersAbsences$ = combineLatest([
    this.studentIds$.pipe(distinctUntilChanged(isEqual)),
    this.selectedDate$,
  ]).pipe(
    switchMap(([studentIds, date]) =>
      studentIds.length > 0 && isToday(date)
        ? this.lessonTeacherService.loadOtherTeachersLessonAbsences(
            this.getMyself(),
            studentIds,
          )
        : of([]),
    ),
    shareReplay(1),
  );

  groupsAvailability$ = this.groupService.groupsAvailability$;

  presenceControlEntries$ = combineLatest([
    this.selectedLesson$,
    this.lessonPresences$,
    this.presenceTypes$,
    this.absenceConfirmationStates$,
    this.otherTeachersAbsences$,
  ]).pipe(map(spread(getPresenceControlEntriesForLesson)));

  presenceControlEntriesByGroup$ = combineLatest([
    this.groupService.group$,
    this.presenceControlEntries$,
    this.groupService.subscriptionDetailPersonIds$,
  ]).pipe(map(spread(filterByGroup)), shareReplay(1));

  presentCount$ = this.presenceControlEntriesByGroup$.pipe(
    map(getCategoryCount("present")),
  );
  absentCount$ = this.presenceControlEntriesByGroup$.pipe(
    map(getCategoryCount("absent")),
  );
  unapprovedCount$ = this.presenceControlEntriesByGroup$.pipe(
    map(getCategoryCount("unapproved")),
  );
  absentPrecedingCount$ = this.presenceControlEntriesByGroup$.pipe(
    map(getPrecedingAbsencesCount()),
  );

  queryParamsString$ = combineLatest([
    this.selectedDate$,
    this.selectedLesson$,
    this.viewMode$,
  ]).pipe(map(spread(this.buildQueryParams.bind(this))), map(serializeParams));

  private destroy$ = new Subject<void>();

  constructor() {
    this.queryParamsString$
      .pipe(takeUntil(this.destroy$))
      .subscribe((returnparams) => {
        this.location.replaceState("/presence-control", returnparams);
        this.confirmBackLinkParams = { returnparams };
      });

    this.viewMode$
      .pipe(
        skip(1), // Only save the view mode setting when changed by user, not on initial loading
        switchMap((v) => this.userSettings.savePresenceControlViewMode(v)),
        takeUntil(this.destroy$),
      )
      .subscribe();

    this.selectedLesson$.pipe(takeUntil(this.destroy$)).subscribe((lesson) => {
      this.groupService.setSelectedLesson(lesson);
    });

    this.lessonPresences$
      .pipe(takeUntil(this.destroy$))
      .subscribe((presences) =>
        this.groupService.setLessonPresences(presences),
      );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  setDate(date: Date): void {
    this.selectedDateSubject$.next(date);
  }

  setLessonId(lessonId?: number | string): void {
    this.selectLessonId$.next(lessonId);
  }

  setViewMode(mode: PresenceControlViewMode): void {
    this.viewModeSubject$.next(mode);
  }

  updateLessonPresencesTypes(
    updates: ReadonlyArray<LessonPresenceUpdate>,
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
            this.settings,
          ),
        ),
      )
      .subscribe((lessonPresences) =>
        this.updateLessonPresences$.next(lessonPresences),
      );
  }

  getNextPresenceType(
    entry: PresenceControlEntry,
  ): Observable<Option<PresenceType>> {
    return this.presenceTypes$.pipe(
      take(1),
      map((presenceTypes) => entry.getNextPresenceType(presenceTypes)),
    );
  }

  hasUnconfirmedAbsences(entry: PresenceControlEntry): Observable<boolean> {
    return this.studentIdsWithUnconfirmedAbsences$.pipe(
      map((ids) => ids.includes(entry.lessonPresence.StudentRef.Id)),
    );
  }

  updateAfterConfirm(): void {
    // Reload the lesson presences if absences have been confirmed in the
    // dossier view and the user is returing to the presence control list
    this.reloadLessonPresences$.next();
    this.reloadStudentIdsWithUnconfirmedAbsences$.next();
  }

  private loadLessonPresencesByLesson(
    lesson: LessonEntry,
  ): Observable<ReadonlyArray<LessonPresence>> {
    return this.loadingService.load(
      this.lessonPresencesService.getListByLessons(lesson.lessons),
    );
  }

  private loadLessonsByDate(
    date: Date,
  ): Observable<ReadonlyArray<LessonEntry>> {
    return this.loadingService
      .load(this.lessonPresencesService.getLessonsByDate(date))
      .pipe(map(getLessonEntriesForLessons));
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
      // with rxjs 7.5 it's not possible to pass undefined - according to the documentation negative numbers means the same as not passing an interval duration at all
      this.settings.unconfirmedAbsencesRefreshTime || -1,
    ).pipe(
      switchMap(() => this.lessonPresencesService.getListOfUnconfirmed()),
      map((unconfirmed) => uniq(unconfirmed.map((p) => p.StudentRef.Id))),
    );
  }

  private buildQueryParams(
    date: Date,
    lessonEntry: Option<LessonEntry>,
    viewMode: PresenceControlViewMode,
  ): Params {
    const params: Params = {
      date: format(date, "yyyy-MM-dd"),
      viewMode,
    };
    if (lessonEntry) {
      params["lesson"] = String(lessonEntry.id);
    }
    return params;
  }

  private getLessonById(lessonId?: number | string): Observable<LessonEntry> {
    const id = String(lessonId);
    return this.lessons$.pipe(
      map(
        (lessons) =>
          // Use lesson from id if available
          (id && lessons.find((l) => l.id === id)) ||
          // Or fallback to currently ongoing lesson as default
          getCurrentLessonEntry(lessons),
      ),
      filter(Boolean),
    );
  }

  private getMyself(): number {
    const token = this.storageService.getPayload();
    return Number(token?.holder_id || token?.id_person);
  }
}
