import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { EvaluateAbsencesStateService } from "../../services/evaluate-absences-state.service";
import { EvaluateAbsencesHeaderComponent } from "./evaluate-absences-header.component";

describe("EvaluateAbsencesHeaderComponent", () => {
  let component: EvaluateAbsencesHeaderComponent;
  let fixture: ComponentFixture<EvaluateAbsencesHeaderComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule(
      buildTestModuleMetadata({
        declarations: [EvaluateAbsencesHeaderComponent],
        providers: [EvaluateAbsencesStateService],
      }),
    ).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EvaluateAbsencesHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
