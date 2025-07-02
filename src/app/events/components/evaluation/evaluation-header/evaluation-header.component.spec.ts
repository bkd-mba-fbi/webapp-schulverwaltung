import { computed, signal } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { of } from "rxjs";
import {
  EvaluationEntry,
  EvaluationStateService,
} from "src/app/events/services/evaluation-state.service";
import { ReportsService } from "src/app/shared/services/reports.service";
import { buildGradingItem } from "src/spec-builders";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { EvaluationHeaderComponent } from "./evaluation-header.component";

describe("EvaluationHeaderComponent", () => {
  let component: EvaluationHeaderComponent;
  let fixture: ComponentFixture<EvaluationHeaderComponent>;
  let reportsServiceMock: jasmine.SpyObj<ReportsService>;
  let evaluationStateServiceMock: jasmine.SpyObj<EvaluationStateService>;
  const entry = signal<EvaluationEntry[]>([]);
  const entryWithoutGrade: EvaluationEntry = {
    gradingItem: buildGradingItem(1),
    grade: {
      Id: 1001,
      Designation: "was there?",
      Value: 0,
      Sort: "10",
      Sufficient: true,
    },
    columns: [],
    criteria: [],
    evaluationRequired: false,
  };

  beforeEach(async () => {
    const mockEntry = {
      gradingItem: buildGradingItem(1),
      grade: {
        Id: 1001,
        Designation: "5.0",
        Value: 5.0,
        Sort: "10",
        Sufficient: true,
      },
      columns: [],
      criteria: [],
      evaluationRequired: false,
    };

    entry.set([mockEntry, entryWithoutGrade]);

    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        imports: [EvaluationHeaderComponent],
        providers: [
          {
            provide: ReportsService,
            useFactory() {
              reportsServiceMock = jasmine.createSpyObj("ReportsService", [
                "getEvaluationReports",
              ]);

              reportsServiceMock.getEvaluationReports
                .withArgs(1)
                .and.returnValue(
                  of([{ type: "crystal", id: 290045, title: "", url: "" }]),
                );

              return reportsServiceMock;
            },
          },
          {
            provide: EvaluationStateService,
            useFactory() {
              evaluationStateServiceMock = jasmine.createSpyObj(
                "EvaluationStateService",
                ["entries"],
              );

              evaluationStateServiceMock.entries.and.callFake(
                computed(() => entry()),
              );
              return evaluationStateServiceMock;
            },
          },
        ],
      }),
    ).compileComponents();

    fixture = TestBed.createComponent(EvaluationHeaderComponent);
    component = fixture.componentInstance;
    const mockEvent = { id: 1, gradingScaleId: 1 };
    fixture.componentRef.setInput("event", mockEvent);
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should show enabled chart button when there are grade entries with numeric values", () => {
    fixture.detectChanges();

    const chartButton = fixture.debugElement.query(By.css(".chart-btn"));
    expect(chartButton).not.toBeNull();
    expect(chartButton.nativeElement.disabled).toBeFalse();
  });

  it("should show disabled chart button when there are no numeric grade values", () => {
    entry.set([entryWithoutGrade]);
    fixture.detectChanges();

    const chartButton = fixture.debugElement.query(By.css(".chart-btn"));
    expect(chartButton).not.toBeNull();
    expect(chartButton.nativeElement.disabled).toBeTrue();
  });

  it("should not show chart button when there is no grading scale", () => {
    const event = { id: 1, gradingScaleId: null };
    fixture.componentRef.setInput("event", event);
    fixture.detectChanges();

    const chartButton = fixture.debugElement.query(By.css(".chart-btn"));
    expect(chartButton).toBeNull();
  });
});
