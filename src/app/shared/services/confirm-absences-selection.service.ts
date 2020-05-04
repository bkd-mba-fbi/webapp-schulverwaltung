import { Injectable } from '@angular/core';
import { map, shareReplay, take } from 'rxjs/operators';
import { not } from 'fp-ts/lib/function';

import { SelectionService } from 'src/app/shared/services/selection.service';
import { LessonPresence } from 'src/app/shared/models/lesson-presence.model';
import { getIdsGroupedByPerson } from 'src/app/shared/utils/lesson-presences';
import { isInstanceOf } from 'src/app/shared/utils/filter';
import { OpenAbsencesEntry } from 'src/app/open-absences/models/open-absences-entry.model';
import { flattenOpenAbsencesEntries } from 'src/app/open-absences/utils/open-absences-entries';

@Injectable({
  providedIn: 'any', // Every module should have its own instance
})
export class ConfirmAbsencesSelectionService extends SelectionService<
  OpenAbsencesEntry | LessonPresence
> {
  selectedIds$ = this.selection$.pipe(
    map(getEntriesByType),
    map(({ openAbsencesEntries, lessonPresences }) =>
      getIdsGroupedByPerson([
        ...flattenOpenAbsencesEntries(openAbsencesEntries),
        ...lessonPresences,
      ])
    ),
    shareReplay(1)
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
  entries: ReadonlyArray<OpenAbsencesEntry | LessonPresence>
): {
  openAbsencesEntries: ReadonlyArray<OpenAbsencesEntry>;
  lessonPresences: ReadonlyArray<LessonPresence>;
} {
  return {
    openAbsencesEntries: entries.filter(isInstanceOf(OpenAbsencesEntry)),
    lessonPresences: entries.filter(
      not(isInstanceOf(OpenAbsencesEntry))
    ) as ReadonlyArray<LessonPresence>,
  };
}
