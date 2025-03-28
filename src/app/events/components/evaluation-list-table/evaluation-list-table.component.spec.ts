import { ComponentFixture, TestBed } from "@angular/core/testing";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { EvaluationListTableComponent } from "./evaluation-list-table.component";

describe("EvaluationListTableComponent", () => {
  let component: EvaluationListTableComponent;
  let fixture: ComponentFixture<EvaluationListTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        imports: [EvaluationListTableComponent],
      }),
    ).compileComponents();

    fixture = TestBed.createComponent(EvaluationListTableComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput("sortCriteria", {
      primarySortKey: "PersonFullname",
      ascending: true,
    });
    fixture.componentRef.setInput("gradingItems", []);
    fixture.componentRef.setInput("selectedColumn", null);

    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
