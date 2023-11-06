import {
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
import { Subject } from "rxjs";
import {
  getControl,
  getControlValueChanges,
  getValidationErrors,
} from "./form";

describe("form utils", () => {
  let formGroup$: Subject<UntypedFormGroup>;
  let submitted$: Subject<boolean>;
  let callback: jasmine.Spy;

  beforeEach(() => {
    formGroup$ = new Subject();
    submitted$ = new Subject();
    callback = jasmine.createSpy("callback");
  });

  describe("getValidationErrors", () => {
    it("returns an observable that emits errors on the form itself", () => {
      getValidationErrors(formGroup$, submitted$).subscribe(callback);
      expect(callback).toHaveBeenCalledWith([]);

      callback.calls.reset();
      const formGroup = buildFormGroup();
      formGroup$.next(formGroup);
      expect(callback).not.toHaveBeenCalled();

      callback.calls.reset();
      formGroup.setErrors({ required: true });
      expect(callback).not.toHaveBeenCalled();

      callback.calls.reset();
      submitted$.next(true);
      expect(callback).toHaveBeenCalledWith([
        { error: "required", params: null },
      ]);

      callback.calls.reset();
      formGroup.setErrors(null);
      expect(callback).toHaveBeenCalledWith([]);

      callback.calls.reset();
      const anotherFormGroup = buildFormGroup();
      formGroup$.next(anotherFormGroup);
      anotherFormGroup.setErrors({ min: { min: 3, actual: 2 } });
      expect(callback).toHaveBeenCalledWith([
        { error: "min", params: { min: 3, actual: 2 } },
      ]);
    });

    it("returns an observable that emits errors on the form control with the given name", () => {
      getValidationErrors(formGroup$, submitted$, "foo").subscribe(callback);
      expect(callback).toHaveBeenCalledWith([]);

      callback.calls.reset();
      const formGroup = buildFormGroup();
      formGroup$.next(formGroup);
      expect(callback).not.toHaveBeenCalled();

      callback.calls.reset();
      formGroup.get("foo")?.setValue("");
      expect(callback).not.toHaveBeenCalled();

      callback.calls.reset();
      submitted$.next(true);
      expect(callback).toHaveBeenCalledWith([
        { error: "required", params: null },
      ]);

      callback.calls.reset();
      formGroup.get("foo")?.setValue("456");
      expect(callback).toHaveBeenCalledWith([]);

      callback.calls.reset();
      formGroup.get("bar")?.setErrors({ required: true });
      expect(callback).not.toHaveBeenCalled();

      callback.calls.reset();
      const anotherFormGroup = buildFormGroup();
      formGroup$.next(anotherFormGroup);
      anotherFormGroup.get("foo")?.setValue("");
      expect(callback).toHaveBeenCalledWith([
        { error: "required", params: null },
      ]);
    });
  });

  describe("getControl", () => {
    it("returns an observable that emits the form control with given name", () => {
      getControl(formGroup$, "foo").subscribe(callback);
      expect(callback).not.toHaveBeenCalled();

      const formGroup = buildFormGroup();
      formGroup$.next(formGroup);
      expect(callback).toHaveBeenCalledWith(formGroup.get("foo"));

      callback.calls.reset();
      const anotherFormGroup = buildFormGroup();
      formGroup$.next(anotherFormGroup);
      expect(callback).not.toHaveBeenCalledWith(formGroup.get("foo"));
      expect(callback).toHaveBeenCalledWith(anotherFormGroup.get("foo"));
    });

    it("returns an observable that emits nothing if no control with given name exists", () => {
      getControl(formGroup$, "baz").subscribe(callback);
      expect(callback).not.toHaveBeenCalled();

      const formGroup = buildFormGroup();
      formGroup$.next(formGroup);
      expect(callback).toHaveBeenCalledWith(null);
    });
  });

  describe("getControlValueChanges", () => {
    it("returns an observable that emits a form control's values", () => {
      getControlValueChanges(formGroup$, "foo").subscribe(callback);
      expect(callback).not.toHaveBeenCalled();

      const formGroup = buildFormGroup();
      formGroup$.next(formGroup);
      expect(callback).not.toHaveBeenCalled();

      formGroup.get("foo")?.setValue("456");
      expect(callback).toHaveBeenCalledWith("456");

      callback.calls.reset();
      const anotherFormGroup = buildFormGroup();
      formGroup$.next(anotherFormGroup);
      expect(callback).not.toHaveBeenCalled();

      formGroup.get("foo")?.setValue("789");
      expect(callback).not.toHaveBeenCalled();

      anotherFormGroup.get("foo")?.setValue("999");
      expect(callback).toHaveBeenCalledWith("999");
    });
  });
});

function buildFormGroup(): UntypedFormGroup {
  return new UntypedFormGroup({
    foo: new UntypedFormControl("123", Validators.required),
    bar: new UntypedFormControl(),
  });
}
