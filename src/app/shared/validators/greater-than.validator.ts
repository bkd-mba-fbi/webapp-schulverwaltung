import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function greaterThanValidator(greaterThanValue: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = Number(control.value);
    return value <= greaterThanValue
      ? { greaterThan: { value, greaterThanValue } }
      : null;
  };
}
