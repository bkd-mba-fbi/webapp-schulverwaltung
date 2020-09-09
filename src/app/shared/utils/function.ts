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

/**
 * Type-safe utility to wrap a ternary function and spread a triplet
 * argument to it.
 */
export function spreadTriplet<A, B, C, T>(
  fn: (a: A, b: B, c: C) => T
): (args: [A, B, C]) => T {
  return ([a, b, c]) => fn(a, b, c);
}

/**
 * Type-safe utility to wrap a quaternary function and spread a
 * quadruplet argument to it.
 */
export function spreadQuadruplet<A, B, C, D, T>(
  fn: (a: A, b: B, c: C, d: D) => T
): (args: [A, B, C, D]) => T {
  return ([a, b, c, d]) => fn(a, b, c, d);
}
