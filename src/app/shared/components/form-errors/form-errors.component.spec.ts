import { signal } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FieldTree, form, required } from "@angular/forms/signals";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { FormErrorsComponent } from "./form-errors.component";

type Model = {
  name: string;
};

describe("FormErrorsComponent", () => {
  let fixture: ComponentFixture<FormErrorsComponent<string>>;
  let element: HTMLElement;
  let testForm: FieldTree<Model, string | number>;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        imports: [FormErrorsComponent],
      }),
    ).compileComponents();

    fixture = TestBed.createComponent(FormErrorsComponent<string>);
    element = fixture.debugElement.nativeElement;

    testForm = TestBed.runInInjectionContext(() => {
      const model = signal<Model>({
        name: "Jane",
      });
      return form(model, (schema) => {
        required(schema.name);
      });
    });

    fixture.componentRef.setInput("field", testForm.name());
    fixture.componentRef.setInput("submitted", true);
  });

  describe("not yet submitted", () => {
    beforeEach(() => {
      fixture.componentRef.setInput("submitted", false);
    });

    it("does not render an error if valid", () => {
      testForm.name().value.set("Jane");
      fixture.detectChanges();

      const errors = element.querySelectorAll(".invalid-feedback");
      expect(errors.length).toBe(0);
    });

    it("does not render an error if invalid", () => {
      testForm.name().value.set("");
      fixture.detectChanges();

      const errors = element.querySelectorAll(".invalid-feedback");
      expect(errors.length).toBe(0);
    });
  });

  describe("submitted", () => {
    beforeEach(() => {
      fixture.componentRef.setInput("submitted", true);
    });

    it("does not render an error if valid", () => {
      testForm.name().value.set("Jane");
      fixture.detectChanges();

      const errors = element.querySelectorAll(".invalid-feedback");
      expect(errors.length).toBe(0);
    });

    it("renders error if invalid", () => {
      testForm.name().value.set("");
      fixture.detectChanges();

      const errors = element.querySelectorAll(".invalid-feedback");
      expect(errors.length).toBe(1);
      expect(errors[0]?.textContent?.trim()).toBe(
        "global.validation-errors.required",
      );
    });
  });
});
