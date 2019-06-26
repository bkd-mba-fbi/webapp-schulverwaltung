import { FormControl } from '@angular/forms';

export function validatationErrorsToArray(
  control: FormControl | null
): ReadonlyArray<{ error: string; params: any }> {
  if (!control) {
    return [];
  }
  return Object.keys(control.errors || {}).map(e => ({
    error: e,
    params:
      control.errors && control.errors[e] instanceof Object
        ? control.errors[e]
        : null
  }));
}
