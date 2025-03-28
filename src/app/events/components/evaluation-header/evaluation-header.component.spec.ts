import { ComponentFixture, TestBed } from "@angular/core/testing";
import { buildEvent } from "src/spec-builders";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { EvaluationHeaderComponent } from "./evaluation-header.component";

describe("EvaluationHeaderComponent", () => {
  let component: EvaluationHeaderComponent;
  let fixture: ComponentFixture<EvaluationHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        imports: [EvaluationHeaderComponent],
      }),
    ).compileComponents();

    fixture = TestBed.createComponent(EvaluationHeaderComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput("event", buildEvent(1));
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
