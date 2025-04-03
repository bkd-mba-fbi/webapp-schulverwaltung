import { ComponentFixture, TestBed } from "@angular/core/testing";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { EvaluationTableComponent } from "./evaluation-table.component";

describe("EvaluationTableComponent", () => {
  let component: EvaluationTableComponent;
  let fixture: ComponentFixture<EvaluationTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        imports: [EvaluationTableComponent],
      }),
    ).compileComponents();

    fixture = TestBed.createComponent(EvaluationTableComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput("sortCriteria", {
      primarySortKey: "name",
      ascending: true,
    });
    fixture.componentRef.setInput("entries", []);
    fixture.componentRef.setInput("selectedColumn", null);
    fixture.componentRef.setInput("eventType", "course");

    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
