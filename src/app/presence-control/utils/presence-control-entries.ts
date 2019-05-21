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
