export function numberToString(value: Maybe<number>): Option<string> {
  return value == null ? null : String(value);
}
