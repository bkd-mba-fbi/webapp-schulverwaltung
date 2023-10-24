import { PresenceControlEntry } from '../models/presence-control-entry.model';

export function getCategoryCount(
  presenceCategory: string,
): (entries: ReadonlyArray<PresenceControlEntry>) => number {
  return (entries) =>
    entries.reduce(
      (count, entry) =>
        count + (entry.presenceCategory === presenceCategory ? 1 : 0),
      0,
    );
}

export function getPrecedingAbsencesCount(): (
  entries: ReadonlyArray<PresenceControlEntry>,
) => number {
  return (entries) =>
    entries.reduce(
      (count, entry) =>
        count +
        (entry.precedingAbsences && entry.precedingAbsences.length > 0 ? 1 : 0),
      0,
    );
}
