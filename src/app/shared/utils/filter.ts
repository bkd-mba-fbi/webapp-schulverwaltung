export function nonZero(value: number): boolean {
  return value !== 0;
}

export function not<A>(fn: (arg: A) => boolean): (arg: A) => boolean {
  return arg => !fn(arg);
}
