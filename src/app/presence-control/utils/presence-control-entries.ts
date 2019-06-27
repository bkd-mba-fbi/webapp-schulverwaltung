import { deburr } from 'lodash-es';
import { PresenceControlEntry } from '../models/presence-control-entry.model';

export function searchPresenceControlEntries(
  presenceControlEntries: ReadonlyArray<PresenceControlEntry>,
  term: string
): ReadonlyArray<PresenceControlEntry> {
  if (!term) {
    return presenceControlEntries;
  }

  return presenceControlEntries.filter(matchesPresenceControlEntry(term));
}

export function getCategoryCount(
  presenceCategory: string
): (entries: ReadonlyArray<PresenceControlEntry>) => number {
  return entries =>
    entries.reduce(
      (count, entry) =>
        count + (entry.presenceCategory === presenceCategory ? 1 : 0),
      0
    );
}

export function filterPreviouslyPresentEntries(
  entries: ReadonlyArray<PresenceControlEntry>
): ReadonlyArray<PresenceControlEntry> {
  return entries.filter(e => !e.lessonPresence.WasAbsentInPrecedingLesson);
}

export function filterPreviouslyAbsentEntries(
  entries: ReadonlyArray<PresenceControlEntry>
): ReadonlyArray<PresenceControlEntry> {
  return entries.filter(e => e.lessonPresence.WasAbsentInPrecedingLesson === 1);
}

function matchesPresenceControlEntry(
  term: string
): (presenceControlEntry: PresenceControlEntry) => boolean {
  const preparedTerm = normalizeSearchValue(term);
  return entry =>
    normalizeSearchValue(entry.lessonPresence.StudentFullName).indexOf(
      preparedTerm
    ) > -1;
}

function normalizeSearchValue(value: string): string {
  return deburr(value.toLowerCase());
}
