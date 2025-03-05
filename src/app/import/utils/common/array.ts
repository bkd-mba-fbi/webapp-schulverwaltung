import { Identifiable } from "src/app/shared/models/common-types";

export function toHash<T extends Identifiable>(
  values: ReadonlyArray<T>,
  iteratee: (value: T) => string | number | symbol = (value) => value.Id,
): Dict<T> {
  return values.reduce(
    (acc, value) => ({ ...acc, [iteratee(value)]: value }),
    {},
  );
}
