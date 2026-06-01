import { ComponentFixture, TestBed } from "@angular/core/testing";
import { buildTest } from "src/spec-builders";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { TestStateService } from "../../../services/test-state.service";
import { TestsEditFormComponent } from "./tests-edit-form.component";

describe("TestsEditFormComponent", () => {
  let fixture: ComponentFixture<TestsEditFormComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        imports: [TestsEditFormComponent],
        providers: [TestStateService],
      }),
    ).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestsEditFormComponent);
    element = fixture.debugElement.nativeElement;
    fixture.componentRef.setInput("test", buildTest(123, 456, []));
    fixture.detectChanges();
  });

  it("renders form", () => {
    const designationInput = getDesignationInput();
    expect(designationInput).not.toBeNull();
    expect(designationInput?.value).toBe(
      "Test Designation for test with id 456",
    );
    expectNoError(designationInput);

    const dateInput = getDateInput();
    expect(dateInput).not.toBeNull();
    expect(dateInput?.value).toBe("09.02.2022");
    expectNoError(dateInput);

    const weightInput = getWeightInput();
    expect(weightInput).not.toBeNull();
    expect(weightInput?.value).toBe("2");
    expectNoError(weightInput);

    const pointGradingRadios = getPointGradingRadios();
    expect(pointGradingRadios).toHaveSize(2);

    const button = getSubmitButton();
    expect(button).not.toBeNull();
    expect(button?.getAttribute("disabled")).toBeFalsy();
  });

  it("validates required fields", () => {
    const designationInput = getDesignationInput();
    if (designationInput) {
      designationInput.value = "";
      designationInput.dispatchEvent(new Event("input"));
    }
    const dateInput = getDateInput();
    if (dateInput) {
      dateInput.value = "";
      dateInput.dispatchEvent(new Event("input"));
    }

    getSubmitButton()?.click();
    fixture.detectChanges();

    expectError(designationInput, "global.validation-errors.required");
    expectError(dateInput, "global.validation-errors.required");
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

    expectError(weightInput, "global.validation-errors.min");
  });

  it("displays max points and maxPointsAdjusted if is point grading type", () => {
    expect(getMaxPointsInput()).toBeNull();
    expect(getMaxPointsAdjustedInput()).toBeNull();

    const [_, pointsRadio] = getPointGradingRadios();
    pointsRadio?.click();
    fixture.detectChanges();

    expect(getMaxPointsInput()).not.toBeNull();
    expect(getMaxPointsAdjustedInput()).not.toBeNull();
  });

  function getDesignationInput() {
    return element.querySelector<HTMLInputElement>("input#designation");
  }

  function getDateInput() {
    return element.querySelector<HTMLInputElement>("input#date");
  }

  function getWeightInput() {
    return element.querySelector<HTMLInputElement>("input#weight");
  }

  function getPointGradingRadios() {
    return Array.from(
      element.querySelectorAll<HTMLInputElement>(
        "input#type-grades, input#type-points",
      ),
    );
  }

  function getMaxPointsInput() {
    return element.querySelector<HTMLInputElement>("input#max-points");
  }

  function getMaxPointsAdjustedInput() {
    return element.querySelector<HTMLInputElement>("input#max-points-adjusted");
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
