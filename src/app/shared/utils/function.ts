/**
 * Type-safe utility to wrap a binary function and spread a tuple
 * argument to it.
 *
 * Example:
 *   const tuples = [string, number][] = [['foo', 3], ['bar', 2]];
 *   function repeatStr(str: string, num: number): string { ... }
 *   tuples.map(spreadTuple(repeatStr))
 */
export function spreadTuple<A, B, T>(
  fn: (a: A, b: B) => T
): (args: [A, B]) => T {
  return ([a, b]) => fn(a, b);
}
