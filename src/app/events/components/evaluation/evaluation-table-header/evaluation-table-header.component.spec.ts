import { ComponentFixture, TestBed } from "@angular/core/testing";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { EvaluationTableHeaderComponent } from "./evaluation-table-header.component";

describe("EvaluationTableHeaderComponent", () => {
  let component: EvaluationTableHeaderComponent;
  let fixture: ComponentFixture<EvaluationTableHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        imports: [EvaluationTableHeaderComponent],
      }),
    ).compileComponents();

    fixture = TestBed.createComponent(EvaluationTableHeaderComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput("sortCriteria", {
      primarySortKey: "name",
      ascending: true,
    });
    fixture.componentRef.setInput("selectedColumn", null);
    fixture.componentRef.setInput("isStudyClass", false);

    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
