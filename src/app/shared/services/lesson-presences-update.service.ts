import { Inject, Injectable, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { combineLatest, merge, Observable, of, Subject } from 'rxjs';
import {
  catchError,
  concatMap,
  debounceTime,
  filter,
  mapTo,
  scan,
  share,
  takeUntil,
} from 'rxjs/operators';
import { withConfig } from 'src/app/rest-error-interceptor';
import { Settings, SETTINGS } from 'src/app/settings';
import { LessonPresence } from '../models/lesson-presence.model';
import { isEmptyArray } from '../utils/array';
import { not } from '../utils/filter';
import { LessonPresencesUpdateRestService } from './lesson-presences-update-rest.service';
import { getNewConfirmationStateId } from 'src/app/presence-control/utils/presence-types';

export const UPDATE_STATE_DEBOUNCE_TIME = 20;
export const UPDATE_REQUEST_DEBOUNCE_TIME = 3000;

export interface LessonPresenceUpdate {
  presence: LessonPresence;
  newPresenceTypeId: Option<number>;
}

interface GroupedLessonPresenceUpdates {
  [presenceTypeId: string]: {
    [lessonId: string]: LessonPresenceUpdate[];
  };
}

enum UpdateActionTypes {
  AddUpdateAction = 'ADD',
  RemoveUpdateAction = 'REMOVE',
}

interface AddUpdateAction {
  type: UpdateActionTypes.AddUpdateAction;
  payload: LessonPresenceUpdate;
}

interface RemoveUpdateAction {
  type: UpdateActionTypes.RemoveUpdateAction;
  payload: LessonPresence;
}

type UpdateAction = AddUpdateAction | RemoveUpdateAction;

/**
 * Service to update lesson presences. Updates UI state optimistically, debounces requests and reverts state on error.
 */
@Injectable({
  providedIn: 'root',
})
export class LessonPresencesUpdateService implements OnDestroy {
  private destroy$ = new Subject<void>();
  private action$ = new Subject<UpdateAction>();
  private pendingUpdates$ = this.action$.pipe(
    scan(
      this.reduceUpdates.bind(this),
      [] as ReadonlyArray<LessonPresenceUpdate>
    ),
    share()
  );
  private revertUpdates$ = new Subject<ReadonlyArray<LessonPresenceUpdate>>();

  // Perform updates after a certain "thinking time"
  private performUpdates$ = this.pendingUpdates$.pipe(
    debounceTime(UPDATE_REQUEST_DEBOUNCE_TIME),
    filter(not(isEmptyArray)),
    concatMap(this.performUpdates.bind(this)) // Execute each request after another to not DOS the backend
  );

  // Update the UI state right-away (latency-compensation)
  stateUpdates$ = merge(this.pendingUpdates$, this.revertUpdates$).pipe(
    debounceTime(UPDATE_STATE_DEBOUNCE_TIME), // Ensure removing of multiple items causes one event
    filter(not(isEmptyArray))
  );

  constructor(
    private toastr: ToastrService,
    private translate: TranslateService,
    private restService: LessonPresencesUpdateRestService,
    @Inject(SETTINGS) private settings: Settings
  ) {
    this.performUpdates$.pipe(takeUntil(this.destroy$)).subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  updatePresenceTypes(
    lessonPresences: ReadonlyArray<LessonPresence>,
    newPresenceTypeId: Option<number> = null
  ): void {
    lessonPresences.forEach((p) =>
      this.dispatchAddUpdate(p, newPresenceTypeId)
    );
  }

  private performUpdates(
    updates: ReadonlyArray<LessonPresenceUpdate>
  ): Observable<GroupedLessonPresenceUpdates> {
    const groupedUpdates = this.groupUpdates(updates);
    return combineLatest(
      Object.keys(groupedUpdates).reduce((result, presenceTypeId) => {
        const presenceTypeGroup = groupedUpdates[presenceTypeId];
        Object.keys(presenceTypeGroup).forEach((lessonId) => {
          const lessonGroup = presenceTypeGroup[lessonId];
          result.push(this.performUpdateForGroup(lessonGroup));
        });
        return result;
      }, [] as Observable<void>[])
    ).pipe(mapTo(groupedUpdates));
  }

  /**
   * Works on updates that have the same `newPresenceType` and are
   * from the same lesson.
   */
  private performUpdateForGroup(
    updates: ReadonlyArray<LessonPresenceUpdate>
  ): Observable<void> {
    // Remove (i.e. consume) entries from pending updates queue
    updates.forEach((u) => this.dispatchRemoveUpdate(u.presence));

    // Perform actual request
    return this.performLessonPresencesUpdatesByIds(
      updates[0].presence.LessonRef.Id,
      updates.map((u) => u.presence.StudentRef.Id),
      updates[0].newPresenceTypeId
    ).pipe(catchError((error) => this.revertUpdatesAfterError(updates, error)));
  }

  /**
   * Performs edit or remove request for given
   * lessonId/personIds. Note, that the response errors of these
   * requests are not handled.
   */
  private performLessonPresencesUpdatesByIds(
    lessonId: number,
    personIds: ReadonlyArray<number>,
    newPresenceTypeId: Option<number> = null
  ): Observable<void> {
    if (newPresenceTypeId) {
      return this.restService.editLessonPresences(
        [lessonId],
        personIds,
        newPresenceTypeId,
        getNewConfirmationStateId(newPresenceTypeId, this.settings) ||
          undefined,
        undefined,
        withConfig({ disableErrorHandling: true })
      );
    }
    return this.restService.removeLessonPresences(
      [lessonId],
      personIds,
      withConfig({ disableErrorHandling: true })
    );
  }

  private revertUpdatesAfterError(
    updates: ReadonlyArray<LessonPresenceUpdate>,
    error: any
  ): Observable<void> {
    console.error('Bulk-update of lesson presences failed');
    console.error(error);

    this.toastr.error(
      this.translate.instant('shared.lesson-presences-update.error')
    );

    // Revert UI back to it's original state
    this.revertUpdates$.next(
      updates.map((u) => ({
        ...u,
        newPresenceTypeId: u.presence.TypeRef.Id,
      }))
    );
    return of(undefined);
  }

  /**
   * Groups the updates array first by presence type, then by lesson.
   */
  private groupUpdates(
    updates: ReadonlyArray<LessonPresenceUpdate>
  ): GroupedLessonPresenceUpdates {
    return updates.reduce((grouped, update) => {
      const presenceTypeId = String(
        update.newPresenceTypeId && update.newPresenceTypeId
      );
      if (!grouped[presenceTypeId]) {
        grouped[presenceTypeId] = {};
      }
      if (
        !Array.isArray(grouped[presenceTypeId][update.presence.LessonRef.Id])
      ) {
        grouped[presenceTypeId][update.presence.LessonRef.Id] = [];
      }

      grouped[presenceTypeId][update.presence.LessonRef.Id].push(update);

      return grouped;
    }, {} as GroupedLessonPresenceUpdates);
  }

  /**
   * Redux-ish reducer to update the updates queue state using actions.
   */
  private reduceUpdates(
    updates: ReadonlyArray<LessonPresenceUpdate>,
    action: UpdateAction
  ): ReadonlyArray<LessonPresenceUpdate> {
    switch (action.type) {
      case UpdateActionTypes.AddUpdateAction:
        const { presence, newPresenceTypeId } = action.payload;
        const index = updates.findIndex(equalsUpdate(presence));
        if (index === -1) {
          return [...updates, { presence, newPresenceTypeId }];
        }
        return [
          ...updates.slice(0, index),
          { presence: updates[index].presence, newPresenceTypeId },
          ...updates.slice(index + 1),
        ];
      case UpdateActionTypes.RemoveUpdateAction:
        return updates.filter(not(equalsUpdate(action.payload)));
      default:
        return updates;
    }
  }

  private dispatchAddUpdate(
    presence: LessonPresence,
    newPresenceTypeId: Option<number>
  ): void {
    this.action$.next({
      type: UpdateActionTypes.AddUpdateAction,
      payload: { presence, newPresenceTypeId },
    });
  }

  private dispatchRemoveUpdate(presence: LessonPresence): void {
    this.action$.next({
      type: UpdateActionTypes.RemoveUpdateAction,
      payload: presence,
    });
  }
}

function equalsUpdate(
  lessonPresence: LessonPresence
): (update: LessonPresenceUpdate) => boolean {
  return (update) =>
    update.presence.LessonRef.Id === lessonPresence.LessonRef.Id &&
    update.presence.StudentRef.Id === lessonPresence.StudentRef.Id;
}
