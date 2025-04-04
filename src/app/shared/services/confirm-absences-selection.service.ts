import { Injectable, inject } from "@angular/core";
import { not } from "fp-ts/es6/Predicate";
import { map, shareReplay, take } from "rxjs/operators";
import { OpenAbsencesEntry } from "src/app/open-absences/models/open-absences-entry.model";
import { flattenOpenAbsencesEntries } from "src/app/open-absences/utils/open-absences-entries";
import { SETTINGS, Settings } from "src/app/settings";
import { LessonPresence } from "src/app/shared/models/lesson-presence.model";
import { SelectionService } from "src/app/shared/services/selection.service";
import { isInstanceOf } from "src/app/shared/utils/filter";
import { getIdsGroupedByPersonAndPresenceType } from "src/app/shared/utils/lesson-presences";

@Injectable()
export class ConfirmAbsencesSelectionService extends SelectionService<
  OpenAbsencesEntry | LessonPresence
> {
  private settings = inject<Settings>(SETTINGS);

  selectedIds$ = this.selection$.pipe(
    map(getEntriesByType),
    map(({ openAbsencesEntries, lessonPresences }) =>
      getIdsGroupedByPersonAndPresenceType([
        ...flattenOpenAbsencesEntries(openAbsencesEntries),
        ...lessonPresences,
      ]),
    ),
    shareReplay(1),
  );

  selectedLessons$ = this.selection$.pipe(
    map(getEntriesByType),
    map(({ openAbsencesEntries, lessonPresences }) => [
      ...flattenOpenAbsencesEntries(openAbsencesEntries),
      ...lessonPresences,
    ]),
    shareReplay(1),
  );

  /**
   * Selected lesson presences that have no absence type (i.e. the
   * default absence type).
   */
  selectedWithoutPresenceType$ = this.selection$.pipe(
    map(getEntriesByType),
    map(({ openAbsencesEntries, lessonPresences }) =>
      [
        ...flattenOpenAbsencesEntries(openAbsencesEntries),
        ...lessonPresences,
      ].filter((p) => p.TypeRef.Id === this.settings.absencePresenceTypeId),
    ),
  );

  clearNonOpenAbsencesEntries(): void {
    this.selection$
      .pipe(take(1), map(getEntriesByType))
      .subscribe(({ openAbsencesEntries }) => this.clear(openAbsencesEntries));
  }

  clearNonLessonPresences(): void {
    this.selection$
      .pipe(take(1), map(getEntriesByType))
      .subscribe(({ lessonPresences }) => this.clear(lessonPresences));
  }
}

function getEntriesByType(
  entries: ReadonlyArray<OpenAbsencesEntry | LessonPresence>,
): {
  openAbsencesEntries: ReadonlyArray<OpenAbsencesEntry>;
  lessonPresences: ReadonlyArray<LessonPresence>;
} {
  return {
    openAbsencesEntries: entries.filter(isInstanceOf(OpenAbsencesEntry)),
    lessonPresences: entries.filter(
      not(isInstanceOf(OpenAbsencesEntry)),
    ) as ReadonlyArray<LessonPresence>,
  };
}
