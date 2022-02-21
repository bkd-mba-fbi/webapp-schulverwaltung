import { deburr } from 'lodash-es';

export interface Searchable {
  readonly studentFullName?: string;
  readonly studyClassNumber?: string;
  readonly designation?: string;
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
  return (entry) =>
    matches(entry.studentFullName, preparedTerm) ||
    matches(entry.studyClassNumber, preparedTerm) ||
    matches(entry.designation, preparedTerm);
}

function matches(field: Maybe<string>, preparedTerm: string): boolean {
  return field ? normalizeSearchValue(field).includes(preparedTerm) : false;
}

function normalizeSearchValue(value: string): string {
  return deburr(value.toLowerCase());
}
