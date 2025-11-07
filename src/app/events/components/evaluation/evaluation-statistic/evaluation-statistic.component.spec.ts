import { ComponentFixture, TestBed } from "@angular/core/testing";
import { EvaluationStateService } from "src/app/events/services/evaluation-state.service";
import { GradingItem } from "src/app/shared/models/grading-item.model";
import { Grade, GradingScale } from "src/app/shared/models/grading-scale.model";
import { buildGradingItem, buildGradingScale } from "src/spec-builders";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { EvaluationStatisticComponent } from "./evaluation-statistic.component";

describe("EvaluationStatisticComponent", () => {
  let component: EvaluationStatisticComponent;
  let fixture: ComponentFixture<EvaluationStatisticComponent>;
  let element: HTMLElement;

  let stateMock: jasmine.SpyObj<EvaluationStateService>;
  let gradingScale: GradingScale;
  let gradingItem: GradingItem;
  let grade1: Grade;
  let grade2: Grade;
  let grade3: Grade;
  let grade4: Grade;
  let grade5: Grade;
  let grade6: Grade;

  beforeEach(async () => {
    gradingItem = buildGradingItem(10001, 100001);

    grade1 = {
      Id: 1,
      Designation: "3.0",
      Value: 3.0,
      Sort: "1",
      Sufficient: false,
    };
    grade2 = {
      Id: 2,
      Designation: "3.5",
      Value: 3.5,
      Sort: "2",
      Sufficient: false,
    };
    grade3 = {
      Id: 3,
      Designation: "4.0",
      Value: 4.0,
      Sort: "3",
      Sufficient: true,
    };
    grade4 = {
      Id: 4,
      Designation: "4.5",
      Value: 4.5,
      Sort: "4",
      Sufficient: true,
    };
    grade5 = {
      Id: 5,
      Designation: "5.0",
      Value: 5.0,
      Sort: "5",
      Sufficient: true,
    };
    grade6 = {
      Id: 6,
      Designation: "5.5",
      Value: 5.5,
      Sort: "6",
      Sufficient: true,
    };

    gradingScale = buildGradingScale(1, [
      grade1,
      grade2,
      grade3,
      grade4,
      grade5,
      grade6,
    ]);

    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        imports: [EvaluationStatisticComponent],
        providers: [
          {
            provide: EvaluationStateService,
            useFactory() {
              stateMock = jasmine.createSpyObj("EvaluationStateService", [
                "sortCriteria",
                "loading",
                "event",
                "columns",
                "entries",
                "gradingScale",
              ]);

              stateMock.sortCriteria.and.returnValue({
                primarySortKey: "name",
                ascending: true,
              });
              stateMock.loading.and.returnValue(false);
              stateMock.event.and.returnValue({
                id: 1000,
                designation: "Mathematik, BVS2024a",
                type: "course",
                studentCount: 24,
                gradingScaleId: 10000,
                hasReviewOfEvaluationStarted: false,
                hasEvaluationStarted: true,
              });
              stateMock.entries.and.returnValue([
                {
                  grade: grade6,
                  gradingItem: gradingItem,
                  columns: [],
                  criteria: [],
                  evaluationRequired: false,
                },
                {
                  grade: grade1,
                  gradingItem: gradingItem,
                  columns: [],
                  criteria: [],
                  evaluationRequired: false,
                },
                {
                  grade: grade2,
                  gradingItem: gradingItem,
                  columns: [],
                  criteria: [],
                  evaluationRequired: false,
                },
                {
                  grade: grade4,
                  gradingItem: gradingItem,
                  columns: [],
                  criteria: [],
                  evaluationRequired: false,
                },
                {
                  grade: grade5,
                  gradingItem: gradingItem,
                  columns: [],
                  criteria: [],
                  evaluationRequired: false,
                },
                {
                  grade: grade5,
                  gradingItem: gradingItem,
                  columns: [],
                  criteria: [],
                  evaluationRequired: false,
                },
                {
                  grade: grade3,
                  gradingItem: gradingItem,
                  columns: [],
                  criteria: [],
                  evaluationRequired: false,
                },
                {
                  grade: null,
                  gradingItem: gradingItem,
                  columns: [],
                  criteria: [],
                  evaluationRequired: false,
                },
              ]);
              stateMock.gradingScale.and.returnValue(gradingScale);

              return stateMock;
            },
          },
        ],
      }),
    ).compileComponents();

    fixture = TestBed.createComponent(EvaluationStatisticComponent);
    component = fixture.componentInstance;
    element = fixture.debugElement.nativeElement;
  });

  it("should create the component", () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it("renders message if event is not available", () => {
    stateMock.event.and.returnValue(null);
    fixture.detectChanges();

    expect(element.textContent).toContain("evaluation.no-event");
  });

  describe("computed properties with mock data", () => {
    beforeEach(async () => {
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it("should filter entries correctly (remove entries with null grades)", () => {
      expect(component.entries().length).toBe(7);
      expect(
        component.entries().every((entry) => entry.grade?.Value != null),
      ).toBeTrue();
    });

    it("should calculate average correctly for valid entries", () => {
      expect(component.average()).toBe(4.36);
    });

    it("should calculate standard deviation correctly", () => {
      expect(component.standardDeviation()).toBe(0.83);
    });

    it("should find the highest grade correctly when RisingGrades is true (higher value is better)", () => {
      expect(component.highestGrade()).toBe(5.5);
    });

    it("should find the lowest grade correctly when RisingGrades is true (lower value is worse)", () => {
      expect(component.lowestGrade()).toBe(3.0);
    });

    it("should count unsufficient grades correctly based on grading scale", () => {
      expect(component.unsufficientCount()).toBe(2);
    });
  });

  describe("computed with empty values", () => {
    beforeEach(async () => {
      stateMock.entries.and.returnValue([]);
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it("should return zero for empty values", () => {
      expect(component.average()).toBe(0);
    });

    it("should return zero for standard deviation", () => {
      expect(component.standardDeviation()).toBe(0);
    });

    it('should return "-" for highest/lowest grade if no entries are available', () => {
      expect(component.highestGrade()).toBe("-");
      expect(component.lowestGrade()).toBe("-");
    });

    it("should return 0 for  unsufficient grades", () => {
      expect(component.unsufficientCount()).toBe(0);
    });
  });

  describe("computed with empty values", () => {
    beforeEach(async () => {
      stateMock.entries.and.returnValue([
        {
          grade: grade1,
          gradingItem: gradingItem,
          columns: [],
          criteria: [],
          evaluationRequired: false,
        },
      ]);
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it("should result for one value", () => {
      expect(component.average()).toBe(3);
    });

    it("should return zero for standard deviation", () => {
      expect(component.standardDeviation()).toBe(0);
    });

    it("should return grade value for highest/lowest if only one grade is available", () => {
      expect(component.highestGrade()).toBe(3);
      expect(component.lowestGrade()).toBe(3);
    });

    it("should return 1 for unsufficient grades", () => {
      expect(component.unsufficientCount()).toBe(1);
    });
  });

  describe("template rendering", () => {
    beforeEach(async () => {
      stateMock.loading.and.returnValue(true);
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it("should display a spinner when state.loading() is true", () => {
      stateMock.loading.and.returnValue(true);
      fixture.detectChanges();
      const spinner = fixture.nativeElement.querySelector("bkd-spinner");
      expect(spinner).toBeTruthy();
    });
  });
});
