import { FormControl, Validators } from "@angular/forms";

export function isEmail(value: unknown): value is string {
  if (typeof value !== "string") {
    return false;
  }
  if (value === "") return false;

  // Instead of implementing a custom email validation, reuse Angular's logic
  // from the form validator
  return Validators.email(new FormControl(value)) === null;
}
