import { DebugElement } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { buildTest } from "src/spec-builders";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { byTestId } from "src/specs/utils";

import { PublishTestComponent } from "./publish-test.component";

describe("PublishTestComponent", () => {
  let component: PublishTestComponent;
  let fixture: ComponentFixture<PublishTestComponent>;
  let debugElement: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        declarations: [PublishTestComponent],
        providers: [NgbActiveModal],
      }),
    ).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PublishTestComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
  });

  it("should create", () => {
    // given
    component.test = buildTest(1, 1, []);

    // when
    fixture.detectChanges();

    // then
    expect(component).toBeTruthy();
  });

  describe("show correct confirmation messages", () => {
    it("should show correct message for unpublished tests", () => {
      // given
      component.test = buildTest(1, 1, []);

      // when
      fixture.detectChanges();

      // then
      expectConfirmationMessage(debugElement, "tests.publishing.publish");
    });

    it("should show correct message for published tests", () => {
      // given
      const publishedTest = buildTest(1, 1, []);
      publishedTest.IsPublished = true;
      component.test = publishedTest;

      // when
      fixture.detectChanges();

      // then
      expectConfirmationMessage(debugElement, "tests.publishing.unpublish");
    });
  });

  describe("click buttons", () => {
    let activeModal: NgbActiveModal;

    beforeEach(() => {
      activeModal = component.activeModal;
      component.test = buildTest(1, 1, []);
    });
    it("should close modal with result true when confirmation button is clicked", () => {
      // given
      spyOn(activeModal, "close");
      const confirmationButton = debugElement.query(byTestId("confirm-button"));
      // when
      confirmationButton.triggerEventHandler("click", null);
      fixture.detectChanges();

      // then
      expect(activeModal.close).toHaveBeenCalledWith(true);
    });

    it("should dismiss modal without a reason", () => {
      // given
      spyOn(activeModal, "dismiss");
      const cancelButton = debugElement.query(byTestId("cancel-button"));

      // when
      cancelButton.triggerEventHandler("click", null);
      fixture.detectChanges();

      // then
      expect(activeModal.dismiss).toHaveBeenCalledWith();
    });
  });
});

function expectConfirmationMessage(
  debugElement: DebugElement,
  expected: string,
) {
  const confirmationMessageElement = debugElement.query(
    byTestId("confirmation-message"),
  );
  expect(confirmationMessageElement.nativeElement.textContent.trim()).toBe(
    expected,
  );
}
