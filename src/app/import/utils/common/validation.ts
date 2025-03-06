export function isPresent(value: unknown): boolean {
  return value != null && value !== "";
}

export function isNumber(value: unknown): value is number {
  return typeof value === "number" && !isNaN(value);
}

export function isOptionalNumber(value: unknown): boolean {
  return !isPresent(value) || isNumber(value);
}

export function isString(value: unknown): value is string {
  return typeof value === "string" && value !== "";
}

export function isEmail(value: unknown): value is string {
  return typeof value === "string" && value.includes("@");
}

export function isOptionalEmail(value: unknown): boolean {
  return !isPresent(value) || isEmail(value);
}
