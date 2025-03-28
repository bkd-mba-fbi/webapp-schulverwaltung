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
      primarySortKey: "PersonFullname",
      ascending: true,
    });
    fixture.componentRef.setInput("gradingItems", []);
    fixture.componentRef.setInput("selectedColumn", null);
    fixture.componentRef.setInput("isStudyClass", false);

    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
