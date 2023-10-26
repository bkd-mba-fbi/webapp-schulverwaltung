import { AbstractControl, UntypedFormGroup } from "@angular/forms";
import { Observable, of, combineLatest, EMPTY } from "rxjs";
import { startWith, map, switchMap, filter, shareReplay } from "rxjs/operators";

/**
 * Emits the validation errors of the form group or the control with
 * the given name.
 *
 * Examples:
 *   genericFormErrors$ = getControlValidationErrors(
 *     this.formGroup$,
 *     this.submitted$
 *   );
 *
 *   emailErrors$ = getControlValidationErrors(
 *     this.formGroup$,
 *     this.submitted$,
 *     'email'
 *   );
 */
export function getValidationErrors(
  formGroup$: Observable<Option<AbstractControl>>,
  submitted$: Observable<boolean>,
  controlName?: string,
): Observable<
  ReadonlyArray<{
    error: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    params: any;
  }>
> {
  return combineLatest([formGroup$, submitted$]).pipe(
    filter(([_, submitted]) => submitted),
    switchMap(([group, _]) => {
      const control = controlName ? group?.get(controlName) || null : group;
      if (control) {
        return control.statusChanges.pipe(
          startWith(control.status),
          map(() => validatationErrorsToArray(control)),
        );
      }
      return of([]);
    }),
    startWith([]),
    shareReplay(1),
  );
}

export function getControl(
  formGroup$: Observable<UntypedFormGroup>,
  controlName: string,
): Observable<Option<AbstractControl>> {
  return formGroup$.pipe(
    map((formGroup) => {
      const control = formGroup.get(controlName);
      return control || null;
    }),
  );
}

export function getControlValueChanges<T>(
  formGroup$: Observable<UntypedFormGroup>,
  controlName: string,
): Observable<T> {
  return getControl(formGroup$, controlName).pipe(
    switchMap((control) => (control ? control.valueChanges : EMPTY)),
  );
}

function validatationErrorsToArray(
  control: AbstractControl | null,
): ReadonlyArray<{
  error: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params: any;
}> {
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
