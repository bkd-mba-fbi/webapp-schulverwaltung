import { deburr } from 'lodash-es';

export interface Searchable {
  readonly studentFullName: string;
}

export function searchEntries<T extends Searchable>(
  entries: ReadonlyArray<T>,
  term: string
): ReadonlyArray<T> {
  if (!term) {
    return entries;
  }

  return entries.filter(matchesEntry(term));
}

function matchesEntry(term: string): (entry: Searchable) => boolean {
  const preparedTerm = normalizeSearchValue(term);
  return entry =>
    normalizeSearchValue(entry.studentFullName).indexOf(preparedTerm) > -1;
}

function normalizeSearchValue(value: string): string {
  return deburr(value.toLowerCase());
}
