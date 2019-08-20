/**
 * Equivalent to TypeScript's Pick<T, K>, to be used with io-ts types
 * like this:
 *
 * const Student = t.type({
 *   Id: t.number,
 *   FullName: t.string,
 *   Email: t.string
 * })
 * const PartialStudent = t.type(pick(Student.props, ['Id', 'FullName']))
 *
 * Important note: this solution does not fail for unexisting
 * properties at compile-time, see:
 * https://github.com/gcanti/io-ts/issues/300
 */
export function pick<O, K extends keyof O>(o: O, keys: Array<K>): Pick<O, K> {
  return keys.reduce((acc, k) => ({ ...acc, [k]: o[k] }), {} as Pick<O, K>);
}
