import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { EditAbsencesComponent } from "./edit-absences.component";

describe("EditAbsencesComponent", () => {
  let component: EditAbsencesComponent;
  let fixture: ComponentFixture<EditAbsencesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule(
      buildTestModuleMetadata({
        imports: [EditAbsencesComponent],
      }),
    ).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditAbsencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
