import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { DropDownItem } from "src/app/shared/models/drop-down-item.model";
import { buildLessonPresence } from "src/spec-builders";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { PresenceControlEntry } from "../../models/presence-control-entry.model";
import { PresenceControlBlockLessonComponent } from "./presence-control-block-lesson.component";

describe("PresenceControlBlockLessonComponent", () => {
  let fixture: ComponentFixture<PresenceControlBlockLessonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        imports: [PresenceControlBlockLessonComponent],
        providers: [NgbActiveModal],
      }),
    ).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PresenceControlBlockLessonComponent);
    fixture.componentRef.setInput("blockPresenceControlEntries", []);
    fixture.detectChanges();
  });

  describe("selection", () => {
    let activeModal: NgbActiveModal;
    let entryA: PresenceControlEntry;
    let entryB: PresenceControlEntry;

    beforeEach(() => {
      activeModal = TestBed.inject(NgbActiveModal);
      spyOn(activeModal, "close");

      const unchecked: DropDownItem = { Key: 10, Value: "Nicht kontrolliert" };
      const checked: DropDownItem = { Key: 20, Value: "Kontrolliert" };
      entryA = buildEntry(1, unchecked);
      entryB = buildEntry(2, checked);

      fixture.componentRef.setInput("entry", entryA);
      fixture.componentRef.setInput("blockPresenceControlEntries", [
        entryA,
        entryB,
      ]);
      fixture.detectChanges();
    });

    it("preselects the entries with the same confirmation state", () => {
      expect(getCheckboxes().map((c) => c.checked)).toEqual([true, false]);
    });

    it("closes with the entries selected by the user", () => {
      getCheckboxes()[1].click();
      fixture.detectChanges();

      expect(getCheckboxes().map((c) => c.checked)).toEqual([true, true]);

      getSaveButton().click();
      expect(activeModal.close).toHaveBeenCalledWith([entryA, entryB]);
    });

    it("disables saving when the user deselects all entries", () => {
      expect(getSaveButton().disabled).toBe(false);

      getCheckboxes()[0].click();
      fixture.detectChanges();

      expect(getCheckboxes().map((c) => c.checked)).toEqual([false, false]);
      expect(getSaveButton().disabled).toBe(true);
    });
  });

  function getCheckboxes(): ReadonlyArray<HTMLInputElement> {
    return Array.from(
      fixture.nativeElement.querySelectorAll("input[type=checkbox]"),
    );
  }

  function getSaveButton(): HTMLButtonElement {
    return fixture.nativeElement.querySelector(".modal-footer .btn-primary");
  }

  function buildEntry(
    lessonId: number,
    confirmationState: DropDownItem,
  ): PresenceControlEntry {
    return new PresenceControlEntry(
      buildLessonPresence(
        lessonId,
        new Date(2000, 0, 23, 7 + lessonId),
        new Date(2000, 0, 23, 8 + lessonId),
        `Lesson ${lessonId}`,
        "Dora Durrer",
        "",
        undefined,
        undefined,
        123,
        Number(confirmationState.Key),
      ),
      null,
      [],
      confirmationState,
    );
  }
});
