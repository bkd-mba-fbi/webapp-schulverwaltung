import { AbstractControl, FormGroup } from '@angular/forms';
import { Observable, of, empty } from 'rxjs';
import { startWith, map, switchMap } from 'rxjs/operators';

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

export function getControl(
  formGroup$: Observable<FormGroup>,
  controlName: string
): Observable<Option<AbstractControl>> {
  return formGroup$.pipe(
    map((formGroup) => {
      const control = formGroup.get(controlName);
      return control || null;
    })
  );
}

export function getControlValueChanges<T>(
  formGroup$: Observable<FormGroup>,
  controlName: string
): Observable<T> {
  return getControl(formGroup$, controlName).pipe(
    switchMap((control) => (control ? control.valueChanges : empty()))
  );
}
