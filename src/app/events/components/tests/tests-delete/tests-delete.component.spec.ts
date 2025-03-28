import { DebugElement } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { buildResult, buildTest } from "src/spec-builders";
import { byTestId } from "src/specs/utils";
import { buildTestModuleMetadata } from "../../../../../spec-helpers";
import { TestsDeleteComponent } from "./tests-delete.component";

describe("TestsDeleteComponent", () => {
  let component: TestsDeleteComponent;
  let fixture: ComponentFixture<TestsDeleteComponent>;
  let debugElement: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        imports: [TestsDeleteComponent],
        providers: [NgbActiveModal],
      }),
    ).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestsDeleteComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
  });

  it("should create with no results", () => {
    component.test = buildTest(100, 10, []);

    fixture.detectChanges();

    expectMessage(debugElement, "confirmation-message", "tests.form.confirm");
    expectMessage(debugElement, "cancel-button", "tests.dialog.no");
    expectMessage(debugElement, "confirm-button", "tests.dialog.yes");

    expect(component.canDeleteTest).toBeTrue();
    expect(component).toBeTruthy();
  });

  it("should create with result", () => {
    component.test = buildTest(100, 10, [buildResult(10, 20)]);

    fixture.detectChanges();

    expectMessage(
      debugElement,
      "confirmation-message",
      "tests.form.delete-not-allowed",
    );
    expectMessage(debugElement, "confirm-button", "tests.dialog.ok");

    expect(component.canDeleteTest).toBeFalse();
    expect(component).toBeTruthy();
  });
});

function expectMessage(
  debugElement: DebugElement,
  testId: string,
  expectedMessage: string,
) {
  expect(
    debugElement.query(byTestId(testId)).nativeElement.textContent.trim(),
  ).toBe(expectedMessage);
}
