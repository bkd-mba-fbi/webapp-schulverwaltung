import { ComponentFixture, TestBed } from "@angular/core/testing";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { buildTest } from "src/spec-builders";

import { TestsEditFormComponent } from "./tests-edit-form.component";
import { TestStateService } from "../../services/test-state.service";

describe("TestsEditFormComponent", () => {
  let component: TestsEditFormComponent;
  let fixture: ComponentFixture<TestsEditFormComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        declarations: [TestsEditFormComponent],
        providers: [TestStateService],
      }),
    ).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestsEditFormComponent);
    component = fixture.componentInstance;
    element = fixture.debugElement.nativeElement;
    fixture.detectChanges();

    component.test = buildTest(123, 456, []);
  });

  it("renders form", () => {
    const designationInput = getDesignationInput();
    expect(designationInput).not.toBeNull();
    expect(designationInput?.value).toBe("");
    expectNoError(designationInput);

    const dateInput = getDateInput();
    expect(dateInput).not.toBeNull();
    expect(dateInput?.value).toBe("");
    expectNoError(dateInput);

    const weightInput = getWeightInput();
    expect(weightInput).not.toBeNull();
    expect(weightInput?.value).toBe("1");
    expectNoError(weightInput);

    const pointGradingRadios = getPointGradingRadios();
    expect(pointGradingRadios).toHaveSize(2);

    const button = getSubmitButton();
    expect(button).not.toBeNull();
    expect(button?.getAttribute("disabled")).toBeFalsy();
  });

  it("validates required fields", () => {
    getSubmitButton()?.click();
    fixture.detectChanges();

    expectError(getDesignationInput(), "global.validation-errors.required");
    expectError(getDateInput(), "global.validation-errors.required");
    expectNoError(getWeightInput());
  });

  it("validates weight to be greater than 0", () => {
    const weightInput = getWeightInput();
    if (weightInput) {
      weightInput.value = "0";
      weightInput.dispatchEvent(new Event("input"));
    }

    getSubmitButton()?.click();
    fixture.detectChanges();

    expectError(weightInput, "global.validation-errors.greaterThan");
  });

  function getDesignationInput() {
    return element.querySelector<HTMLInputElement>(
      '[formcontrolname="designation"]',
    );
  }

  function getDateInput() {
    return element.querySelector<HTMLInputElement>('[formcontrolname="date"]');
  }

  function getWeightInput() {
    return element.querySelector<HTMLInputElement>(
      '[formcontrolname="weight"]',
    );
  }

  function getPointGradingRadios() {
    return Array.from(
      element.querySelectorAll<HTMLInputElement>(
        '[formcontrolname="isPointGrading"]',
      ),
    );
  }

  function getSubmitButton() {
    return element.querySelector<HTMLButtonElement>('button[type="submit"]');
  }

  function expectNoError(input: Option<HTMLElement>) {
    expect(input).not.toBeNull();

    const errorElement =
      input?.parentElement?.querySelector(".invalid-feedback");
    expect(errorElement?.textContent?.trim() ?? "").toBe("");
  }

  function expectError(input: Option<HTMLElement>, error: string) {
    expect(input).not.toBeNull();

    const errorElement =
      input?.parentElement?.querySelector(".invalid-feedback");
    expect(errorElement?.textContent).toContain(error);
  }
});
