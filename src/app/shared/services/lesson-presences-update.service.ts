import { Injectable, inject } from "@angular/core";
import { uniq } from "lodash-es";
import { Observable, combineLatest } from "rxjs";
import { map, shareReplay, switchMap, take } from "rxjs/operators";
import { PresenceControlEntry } from "src/app/presence-control/models/presence-control-entry.model";
import { getNewConfirmationStateId } from "src/app/presence-control/utils/presence-types";
import { SETTINGS, Settings } from "src/app/settings";
import { LessonPresence } from "../models/lesson-presence.model";
import { LessonPresencesUpdateRestService } from "./lesson-presences-update-rest.service";
import { LoadingService } from "./loading-service";
import { PresenceTypesService } from "./presence-types.service";

export interface LessonPresenceUpdate {
  presence: LessonPresence;
  newPresenceTypeId: Option<number>;
}

export function getEntryUpdateContext(entry: PresenceControlEntry): string {
  return `presence-control-update-${entry.id}`;
}

/**
 * Service to update lesson presences. Each call performs the request
 * synchronously setting the loading state for the affected entries using
 * `getEntryUpdateContext`.
 */
@Injectable({
  providedIn: "root",
})
export class LessonPresencesUpdateService {
  private restService = inject(LessonPresencesUpdateRestService);
  private presenceTypesService = inject(PresenceTypesService);
  private loadingService = inject(LoadingService);
  private settings = inject<Settings>(SETTINGS);

  /**
   * Update the presence type of the given entry (or multiple entries of the
   * same student for block lessons).
   */
  updatePresenceType(
    entryOrEntries: PresenceControlEntry | ReadonlyArray<PresenceControlEntry>,
    newPresenceTypeId: Option<number> = null,
  ): Observable<ReadonlyArray<LessonPresenceUpdate>> {
    const entries = Array.isArray(entryOrEntries)
      ? entryOrEntries
      : [entryOrEntries];
    const presences = entries.map(({ lessonPresence }) => lessonPresence);
    const update$ = this.performUpdate(presences, newPresenceTypeId).pipe(
      shareReplay(1), // Make sure we're not executing the request multiple times
    );
    return combineLatest(
      // Update the loading state for each affected entry
      entries.map((entry) =>
        this.loadingService.load(update$, getEntryUpdateContext(entry)),
      ),
    ).pipe(
      map(() =>
        entries.map((entry) => ({
          presence: entry.lessonPresence,
          newPresenceTypeId,
        })),
      ),
    );
  }

  private performUpdate(
    presences: ReadonlyArray<LessonPresence>,
    newPresenceTypeId: Option<number>,
  ): Observable<void> {
    const personIds = uniq(presences.map((p) => p.StudentRef.Id));
    const lessonIds = uniq(presences.map((p) => p.LessonRef.Id));

    if (personIds.length !== 1) {
      throw new Error("Cannot update lesson presences for multiple students");
    }

    if (newPresenceTypeId) {
      return this.presenceTypesService.getPresenceType(newPresenceTypeId).pipe(
        take(1),
        switchMap((type) =>
          this.restService.editLessonPresences(
            lessonIds,
            personIds,
            type?.Id,
            getNewConfirmationStateId(type, this.settings) || undefined,
          ),
        ),
      );
    }
    return this.restService.removeLessonPresences(lessonIds, personIds);
  }
}
