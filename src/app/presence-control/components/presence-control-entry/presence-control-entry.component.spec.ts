import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { buildLessonPresence } from "src/spec-builders";
import {
  buildTestModuleMetadata,
  changeInput,
  settings,
} from "src/spec-helpers";
import { PresenceControlEntry } from "../../models/presence-control-entry.model";
import { PresenceControlEntryComponent } from "./presence-control-entry.component";
import { PresenceControlViewMode } from "../../../shared/models/user-settings.model";

describe("PresenceControlEntryComponent", () => {
  let component: PresenceControlEntryComponent;
  let fixture: ComponentFixture<PresenceControlEntryComponent>;
  let element: HTMLElement;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule(
      buildTestModuleMetadata({
        declarations: [PresenceControlEntryComponent],
      }),
    ).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PresenceControlEntryComponent);
    component = fixture.componentInstance;
    element = fixture.debugElement.nativeElement;
    changeInput(component, "entry", buildPresenceControlEntry());
  });

  describe("list view", () => {
    beforeEach(() => {
      component.viewMode = PresenceControlViewMode.List;
    });

    it("should always show student name and incident action", () => {
      fixture.detectChanges();
      expect(element.textContent).toContain("Marie Curie");
      expect(element.textContent).toContain("presence-control.entry.incident");
    });

    it("should show study class name", () => {
      component.showClassName = true;
      fixture.detectChanges();
      expect(element.textContent).toContain("9a");
    });

    it("should not show study class name", () => {
      component.showClassName = false;
      fixture.detectChanges();
      expect(element.textContent).not.toContain("9a");
    });
  });

  describe("grid view", () => {
    beforeEach(() => {
      component.viewMode = PresenceControlViewMode.Grid;
    });

    it("should always show student name and incident action", () => {
      fixture.detectChanges();
      expect(element.textContent).toContain("Marie Curie");
      expect(element.textContent).toContain("presence-control.entry.incident");
    });

    it("should never show study class name", () => {
      component.showClassName = false;
      fixture.detectChanges();
      expect(element.textContent).not.toContain("9a");

      component.showClassName = true;
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
