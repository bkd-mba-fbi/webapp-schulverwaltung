import { ComponentFixture, TestBed } from "@angular/core/testing";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { EvaluateAbsencesStateService } from "../../services/evaluate-absences-state.service";
import { EvaluateAbsencesHeaderComponent } from "./evaluate-absences-header.component";

describe("EvaluateAbsencesHeaderComponent", () => {
  let component: EvaluateAbsencesHeaderComponent;
  let fixture: ComponentFixture<EvaluateAbsencesHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        imports: [EvaluateAbsencesHeaderComponent],
        providers: [EvaluateAbsencesStateService],
      }),
    ).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EvaluateAbsencesHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
