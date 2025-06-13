import { ComponentFixture, TestBed } from "@angular/core/testing";
import { buildGradingScale } from "src/spec-builders";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { EvaluationChartComponent } from "./evaluation-chart.component";

describe("EvaluationChartComponent: Basic Features", () => {
  let component: EvaluationChartComponent;
  let fixture: ComponentFixture<EvaluationChartComponent>;

  let mockResizeObserver: jasmine.SpyObj<ResizeObserver>;

  beforeEach(async () => {
    mockResizeObserver = jasmine.createSpyObj("ResizeObserver", [
      "observe",
      "disconnect",
    ]);
    spyOn(window, "ResizeObserver").and.returnValue(mockResizeObserver);

    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        imports: [EvaluationChartComponent],
      }),
    ).compileComponents();

    fixture = TestBed.createComponent(EvaluationChartComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput("entries", [
      { grade: { Value: 5.5, Sufficient: true }, studentId: 1 },
      { grade: { Value: 3, Sufficient: false }, studentId: 2 },
    ]);
    const gradingScale = buildGradingScale(1106, [
      {
        Designation: "5.5",
        Value: 5.5,
        Id: 2349,
        Sort: "10",
        Sufficient: true,
      },
      {
        Designation: "3",
        Value: 3.0,
        Id: 2348,
        Sort: "11",
        Sufficient: false,
      },
    ]);
    fixture.componentRef.setInput("gradingScale", gradingScale);

    fixture.detectChanges();
  });

  afterEach(() => {
    if (component["resizeObserver"]) {
      component["resizeObserver"].disconnect();
    }
  });

  describe("hasData computed property", () => {
    it("should return true when there are entries leading to chart data", () => {
      fixture.detectChanges();
      expect(component.entries().length).toBeGreaterThan(0);

      expect(component.hasData()).toBeTrue();
    });

    it("should return false when entries array is empty", () => {
      fixture.componentRef.setInput("entries", []);
      fixture.detectChanges();
      expect(component.hasData()).toBeFalse();
    });
  });

  describe("chartInnerWidth computed property", () => {
    it("should calculate a valid width when there are entries", () => {
      fixture.componentRef.setInput("entries", [
        { grade: { Value: 4, Sufficient: true }, studentId: 1 },
        { grade: { Value: 5, Sufficient: false }, studentId: 2 },
      ]);
      fixture.componentRef.setInput("gradingScale", buildGradingScale(1));
      fixture.detectChanges();
      expect(component.chartInnerWidth()).toBeGreaterThanOrEqual(
        component.minChartWidth(),
      );
    });

    it("should return minChartWidth when there are no entries", () => {
      fixture.componentRef.setInput("entries", []);
      fixture.detectChanges();
      expect(component.chartInnerWidth()).toBe(component.minChartWidth());
    });
  });
});
