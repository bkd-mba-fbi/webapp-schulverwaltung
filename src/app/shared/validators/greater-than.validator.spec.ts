import { FormControl, ValidatorFn } from "@angular/forms";
import { greaterThanValidator } from "./greater-than.validator";

describe("greaterThanValidator", () => {
  let validate: ValidatorFn;
  let control: FormControl;

  beforeEach(() => {
    validate = greaterThanValidator(42);
    control = new FormControl();
  });

  it("returns null if the control's value is greater than the specified value", () => {
    control.setValue(100);
    expect(validate(control)).toBeNull();

    control.setValue(43);
    expect(validate(control)).toBeNull();

    control.setValue(42.001);
    expect(validate(control)).toBeNull();
  });

  it("returns an error if the control's value equals the specified value", () => {
    control.setValue(42);
    expect(validate(control)).toEqual({
      greaterThan: { value: 42, greaterThanValue: 42 },
    });
  });

  it("returns an error if the control's value is smaller than the specified value", () => {
    control.setValue(0);
    expect(validate(control)).toEqual({
      greaterThan: { value: 0, greaterThanValue: 42 },
    });

    control.setValue(41);
    expect(validate(control)).toEqual({
      greaterThan: { value: 41, greaterThanValue: 42 },
    });

    control.setValue(41.999);
    expect(validate(control)).toEqual({
      greaterThan: { value: 41.999, greaterThanValue: 42 },
    });
  });
});
