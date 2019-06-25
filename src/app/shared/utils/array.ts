/**
 * Given a certain element of an array, returns the previous element
 * the array (or null if it's the last). Must be inialized with an
 * equality function.
 */
export function previousElement<T>(
  equal: (a: T, b: T) => boolean = (a, b) => a === b
): (entry: Option<T>, entries: ReadonlyArray<T>) => Option<T> {
  return (entry, entries) => {
    if (entry && entries.length > 0) {
      const index = entries.findIndex(e => equal(e, entry));
      if (index > 0) {
        return entries[index - 1];
      }
    }
    return null;
  };
}

/**
 * Given a certain element of an array, returns the next element the
 * array (or null if it's the last). Must be inialized with an
 * equality function.
 */
export function nextElement<T>(
  equal: (a: T, b: T) => boolean = (a, b) => a === b
): (entry: Option<T>, entries: ReadonlyArray<T>) => Option<T> {
  return (entry, entries) => {
    if (entry && entries.length > 0) {
      const index = entries.findIndex(e => equal(e, entry));
      if (index > -1 && index < entries.length - 1) {
        return entries[index + 1];
      }
    }
    return null;
  };
}

export function isFirstElement<T>(
  equal: (a: T, b: T) => boolean = (a, b) => a === b
): (entry: Option<T>, entries: ReadonlyArray<T>) => boolean {
  return (entry, entries) =>
    Boolean(entry && entries.length > 0 && equal(entry, entries[0]));
}

export function isLastElement<T>(
  equal: (a: T, b: T) => boolean = (a, b) => a === b
): (entry: Option<T>, entries: ReadonlyArray<T>) => boolean {
  return (entry, entries) =>
    Boolean(
      entry && entries.length > 0 && equal(entry, entries[entries.length - 1])
    );
}

export function isEmptyArray(array: any[] | ReadonlyArray<any>): boolean {
  return array.length === 0;
}
