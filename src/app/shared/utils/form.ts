import { AbstractControl } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

export function getValidationErrors(
  control: Option<AbstractControl>
): Observable<ReadonlyArray<{ error: string; params: any }>> {
  if (control) {
    return control.statusChanges.pipe(
      startWith(control.status),
      map(() => validatationErrorsToArray(control))
    );
  }
  return of([]);
}

/**
 * Emits the validation errors of the control with the given name.
 *
 * Example:
 *   emailErrors$ = this.formGroup$.pipe(
 *     switchMap(getControlValidationErrors('email'))
 *   );
 */
export function getControlValidationErrors(
  controlName: string
): (
  group: Option<AbstractControl>
) => Observable<ReadonlyArray<{ error: string; params: any }>> {
  return (group) => {
    return getValidationErrors(group?.get(controlName) || null);
  };
}

function validatationErrorsToArray(
  control: AbstractControl | null
): ReadonlyArray<{ error: string; params: any }> {
  if (!control) {
    return [];
  }
  return Object.keys(control.errors || {}).map((e) => ({
    error: e,
    params:
      control.errors && control.errors[e] instanceof Object
        ? control.errors[e]
        : null,
  }));
}
