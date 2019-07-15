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

function validatationErrorsToArray(
  control: AbstractControl | null
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
