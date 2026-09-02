import { ComponentFixture, TestBed } from "@angular/core/testing";
import { buildLessonPresence } from "src/spec-builders";
import { buildTestModuleMetadata, settings } from "src/spec-helpers";
import { PresenceControlViewMode } from "../../../shared/models/user-settings.model";
import { PresenceControlEntry } from "../../models/presence-control-entry.model";
import { PresenceControlEntryComponent } from "./presence-control-entry.component";

describe("PresenceControlEntryComponent", () => {
  let fixture: ComponentFixture<PresenceControlEntryComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        imports: [PresenceControlEntryComponent],
      }),
    ).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PresenceControlEntryComponent);
    element = fixture.debugElement.nativeElement;

    fixture.componentRef.setInput("entry", buildPresenceControlEntry());
  });

  describe("list view", () => {
    beforeEach(() => {
      fixture.componentRef.setInput("viewMode", PresenceControlViewMode.List);
    });

    it("should always show student name and incident action", () => {
      fixture.detectChanges();
      expect(element.textContent).toContain("Marie Curie");
      expect(element.textContent).toContain("presence-control.entry.incident");
    });

    it("should show study class name", () => {
      fixture.componentRef.setInput("showClassName", true);
      fixture.detectChanges();
      expect(element.textContent).toContain("9a");
    });

    it("should not show study class name", () => {
      fixture.componentRef.setInput("showClassName", false);
      fixture.detectChanges();
      expect(element.textContent).not.toContain("9a");
    });
  });

  describe("grid view", () => {
    beforeEach(() => {
      fixture.componentRef.setInput("viewMode", PresenceControlViewMode.Grid);
    });

    it("should always show student name and incident action", () => {
      fixture.detectChanges();
      expect(element.textContent).toContain("Marie Curie");
      expect(element.textContent).toContain("presence-control.entry.incident");
    });

    it("should never show study class name", () => {
      fixture.componentRef.setInput("showClassName", false);
      fixture.detectChanges();
      expect(element.textContent).not.toContain("9a");

      fixture.componentRef.setInput("showClassName", true);
      fixture.detectChanges();
      expect(element.textContent).not.toContain("9a");
    });
  });
});

function buildPresenceControlEntry(): PresenceControlEntry {
  const presenceControlEntry = new PresenceControlEntry(
    buildLessonPresence(
      1,
      new Date(2019, 1, 1, 15, 0),
      new Date(2019, 1, 1, 16, 0),
      "Physik",
      "Marie Curie",
    ),
    null,
    null,
  );

  Object.defineProperty(presenceControlEntry, "settings", {
    get: () => settings,
  });
  return presenceControlEntry;
}
