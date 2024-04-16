import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { OpenAbsencesComponent } from "./open-absences.component";

describe("OpenAbsencesComponent", () => {
  let component: OpenAbsencesComponent;
  let fixture: ComponentFixture<OpenAbsencesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule(
      buildTestModuleMetadata({
        imports: [OpenAbsencesComponent],
      }),
    ).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenAbsencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
