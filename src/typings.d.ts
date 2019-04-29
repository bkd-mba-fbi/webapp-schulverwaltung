type Option<T> = T | null;
type Maybe<T> = T | undefined | null;

interface Dict<T> {
  [index: string]: T;
}
