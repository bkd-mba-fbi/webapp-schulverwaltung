import { deburr } from "lodash-es";

export function searchEntries<T>(
  entries: ReadonlyArray<T>,
  searchFields: ReadonlyArray<keyof T>,
  term: string,
): ReadonlyArray<T> {
  if (!term) {
    return entries;
  }

  return entries.filter(matchesEntry(searchFields, term));
}

function matchesEntry<T>(
  searchFields: ReadonlyArray<keyof T>,
  term: string,
): (entry: T) => boolean {
  const normalizedTerm = normalizeSearchValue(term);
  return (entry) =>
    searchFields.some((field) => matches(entry[field], normalizedTerm));
}

function matches(value: unknown, normalizedTerm: string): boolean {
  return value
    ? // eslint-disable-next-line @typescript-eslint/no-base-to-string
      normalizeSearchValue(String(value)).includes(normalizedTerm)
    : false;
}

function normalizeSearchValue(value: string): string {
  return deburr(value.toLowerCase());
}
