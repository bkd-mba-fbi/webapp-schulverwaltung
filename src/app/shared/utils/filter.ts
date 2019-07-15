export function nonZero(value: number): boolean {
  return value !== 0;
}

export function notNull<T>(arg: T | null): arg is T {
  return arg !== null;
}

export function not<A>(fn: (arg: A) => boolean): (arg: A) => boolean {
  return arg => !fn(arg);
}
