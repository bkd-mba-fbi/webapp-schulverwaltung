import { ComponentFixture, TestBed } from "@angular/core/testing";
import { BehaviorSubject, map, of } from "rxjs";
import { Test } from "src/app/shared/models/test.model";
import { ConfigurationsRestService } from "src/app/shared/services/configurations-rest.service";
import { GradingScalesRestService } from "src/app/shared/services/grading-scales-rest.service";
import { buildGradingScale, buildResult, buildTest } from "src/spec-builders";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { TestStateService } from "../../../services/test-state.service";
import { TestsEditFormComponent } from "./tests-edit-form.component";

describe("TestsEditFormComponent", () => {
  let fixture: ComponentFixture<TestsEditFormComponent>;
  let element: HTMLElement;
  let configurationsRestService: jasmine.SpyObj<ConfigurationsRestService>;
  let gradingScalesRestService: jasmine.SpyObj<GradingScalesRestService>;
  let gradingScaleIds$: BehaviorSubject<ReadonlyArray<number>>;
  let test: Test;

  beforeEach(async () => {
    configurationsRestService = jasmine.createSpyObj<ConfigurationsRestService>(
      "ConfigurationsRestService",
      ["getSubscriptionDetailsDisplay"],
    );
    gradingScaleIds$ = new BehaviorSubject<ReadonlyArray<number>>([100, 101]);
    configurationsRestService.getSubscriptionDetailsDisplay.and.returnValue(
      gradingScaleIds$.pipe(
        map((testGradingScaleIds) => ({
          adAsColumns: [],
          adAsCriteria: [],
          testGradingScaleIds,
        })),
      ),
    );

    gradingScalesRestService = jasmine.createSpyObj<GradingScalesRestService>(
      "GradingScalesRestService",
      ["getListForIds"],
    );
    gradingScalesRestService.getListForIds.and.callFake((_ids: number[]) => {
      return of([
        { ...buildGradingScale(100), Designation: "Zehntelnoten" },
        { ...buildGradingScale(101), Designation: "Viertelnoten" },
      ]);
    });

    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        imports: [TestsEditFormComponent],
        providers: [
          TestStateService,
          {
            provide: ConfigurationsRestService,
            useValue: configurationsRestService,
          },
          {
            provide: GradingScalesRestService,
            useValue: gradingScalesRestService,
          },
        ],
      }),
    ).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestsEditFormComponent);
    element = fixture.debugElement.nativeElement;
    test = {
      ...buildTest(123, 456, []),
      GradingScaleId: 101,
    };
    fixture.componentRef.setInput("test", test);
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

    const gradingScaleRadios = getGradingScaleRadios();
    expect(gradingScaleRadios).toHaveSize(2);
    expect(gradingScaleRadios[1]?.checked).toBeTrue();

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

  describe("grading type", () => {
    it("enables grading type radios if test has no results yet", () => {
      const [gradesRadio, pointsRadio] = getPointGradingRadios();
      expect(gradesRadio?.disabled).toBe(false);
      expect(pointsRadio?.disabled).toBe(false);
    });

    it("enables grading type radios if test already has results", () => {
      fixture.componentRef.setInput("test", {
        ...test,
        Results: [buildResult(123, 789, 654)],
      } satisfies Test);
      fixture.detectChanges();

      const [gradesRadio, pointsRadio] = getPointGradingRadios();
      expect(gradesRadio?.disabled).toBe(true);
      expect(pointsRadio?.disabled).toBe(true);
    });
  });

  describe("max points", () => {
    describe("grades grading type", () => {
      beforeEach(() => {
        fixture.componentRef.setInput("test", {
          ...test,
          IsPointGrading: false,
        } satisfies Test);
        fixture.detectChanges();
      });

      it("does not display maxPoints and maxPointsAdjusted", () => {
        expect(getMaxPointsInput()).toBeNull();
        expect(getMaxPointsAdjustedInput()).toBeNull();
      });
    });

    describe("points grading type", () => {
      beforeEach(() => {
        fixture.componentRef.setInput("test", {
          ...test,
          IsPointGrading: true,
        } satisfies Test);
        fixture.detectChanges();
      });

      it("displays maxPoints and maxPointsAdjusted if is point grading type", () => {
        expect(getMaxPointsInput()).not.toBeNull();
        expect(getMaxPointsAdjustedInput()).not.toBeNull();
      });

      it("enables maxPoints and maxPointsAdjusted if test has no results yet", () => {
        expect(getMaxPointsInput()?.disabled).toBe(false);
        expect(getMaxPointsAdjustedInput()?.disabled).toBe(false);
      });

      it("enables maxPoints and maxPointsAdjusted if test already has results", () => {
        fixture.componentRef.setInput("test", {
          ...test,
          IsPointGrading: true,
          Results: [buildResult(123, 789, 654)],
        } satisfies Test);
        fixture.detectChanges();

        expect(getMaxPointsInput()?.disabled).toBe(false);
        expect(getMaxPointsAdjustedInput()?.disabled).toBe(false);
      });
    });
  });

  describe("grading scale", () => {
    describe("with test (editing)", () => {
      it("selects the grading scale from the given test", () => {
        fixture.componentRef.setInput("defaultGradingScaleId", 100);
        fixture.detectChanges();

        const gradingScaleRadios = getGradingScaleRadios();
        expect(gradingScaleRadios).toHaveSize(2);
        expect(gradingScaleRadios[1]?.checked).toBeTrue();
      });
    });

    describe("without test (creating)", () => {
      beforeEach(() => {
        fixture.componentRef.setInput("test", null);
        fixture.detectChanges();
      });

      it("selects the given default grading scale if no test available", () => {
        fixture.componentRef.setInput("defaultGradingScaleId", 101);
        fixture.detectChanges();

        const gradingScaleRadios = getGradingScaleRadios();
        expect(gradingScaleRadios).toHaveSize(2);
        expect(gradingScaleRadios[1]?.checked).toBeTrue();
      });

      it("selects the first grading scale if no default available", () => {
        fixture.componentRef.setInput("defaultGradingScaleId", null);
        fixture.detectChanges();

        const gradingScaleRadios = getGradingScaleRadios();
        expect(gradingScaleRadios).toHaveSize(2);
        expect(gradingScaleRadios[0]?.checked).toBeTrue();
      });
    });
  });

  describe("saving", () => {
    let saveCallback: jasmine.Spy;
    beforeEach(() => {
      saveCallback = jasmine.createSpy("save");
      fixture.componentInstance.save.subscribe(saveCallback);
    });

    it("saves form", () => {
      fixture.detectChanges();

      const saveButton = element.querySelector<HTMLButtonElement>(
        "button[type='submit']",
      );
      expect(saveButton).not.toBeNull();
      saveButton?.click();

      expect(saveCallback).toHaveBeenCalled();
    });

    it("saves form without grading scales available", () => {
      gradingScaleIds$.next([]);
      fixture.detectChanges();

      const saveButton = element.querySelector<HTMLButtonElement>(
        "button[type='submit']",
      );
      expect(saveButton).not.toBeNull();
      saveButton?.click();

      expect(saveCallback).toHaveBeenCalled();
    });
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

  function getGradingScaleRadios() {
    return Array.from(
      element.querySelectorAll<HTMLInputElement>("input[type=radio]"),
    ).filter((r) => r.id.startsWith("grading-scale-id-"));
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

    const errorElement = input
      ?.closest('[class^="col-"], [class*=" col-"]')
      ?.querySelector(".invalid-feedback");
    expect(errorElement?.textContent).toContain(error);
  }
});
