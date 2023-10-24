/**
 * Type-safe utility to wrap a function and spread an array as
 * arguments to it.
 *
 * Example:
 *   const tuples = [string, number][] = [['foo', 3], ['bar', 2]];
 *   function repeatStr(str: string, num: number): string { ... }
 *   tuples.map(spread(repeatStr))
 */
export function spread<A extends unknown[], R>(
  fn: (...args: A) => R,
): (args: A) => R {
  return (args) => fn(...args);
}
