type Option<T> = T | null;
type Maybe<T> = T | undefined | null;

interface Dict<T> {
  [index: string]: T;
}

interface Constructor<T> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  new (...args: any[]): T;
}
