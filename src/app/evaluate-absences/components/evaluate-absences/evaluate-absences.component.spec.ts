import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { EvaluateAbsencesModule } from "../../evaluate-absences.module";
import { EvaluateAbsencesComponent } from "./evaluate-absences.component";

describe("EvaluateAbsencesComponent", () => {
  let component: EvaluateAbsencesComponent;
  let fixture: ComponentFixture<EvaluateAbsencesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule(
      buildTestModuleMetadata({
        imports: [EvaluateAbsencesModule],
      }),
    ).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EvaluateAbsencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
