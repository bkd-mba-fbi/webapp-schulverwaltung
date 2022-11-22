export function nonZero(value: number): boolean {
  return value !== 0;
}

export function notNull<T>(arg: T | null): arg is T {
  return arg !== null;
}

export function nonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.length > 0;
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

export function isInstanceOf<T>(
  type: Constructor<T>
): (value: any) => value is T {
  // eslint-disable-next-line
  return function (value: any): value is T {
    return value instanceof type;
  };
}

export function unique<T>(value: T, index: number, array: T[]): boolean {
  return array.indexOf(value) === index;
}
