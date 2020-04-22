export function nonZero(value: number): boolean {
  return value !== 0;
}

export function notNull<T>(arg: T | null): arg is T {
  return arg !== null;
}

export function not<A>(fn: (arg: A) => boolean): (arg: A) => boolean {
  return (arg) => !fn(arg);
}

export function longerOrEqual<T extends { length: number }>(
  length: number
): (value: T) => boolean {
  return (value) => value.length >= length;
}

type Falsy = null | undefined | '' | false | 0 | void | never;

export function isTruthy<T>(value: T): value is Exclude<T, Falsy> {
  return Boolean(value);
}
