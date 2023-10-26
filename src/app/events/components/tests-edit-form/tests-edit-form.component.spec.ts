import { ComponentFixture, TestBed } from "@angular/core/testing";
import { buildTestModuleMetadata } from "src/spec-helpers";

import { TestsEditFormComponent } from "./tests-edit-form.component";
import { TestStateService } from "../../services/test-state.service";

describe("TestsEditFormComponent", () => {
  let component: TestsEditFormComponent;
  let fixture: ComponentFixture<TestsEditFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        declarations: [TestsEditFormComponent],
        providers: [TestStateService],
      }),
    ).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestsEditFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
