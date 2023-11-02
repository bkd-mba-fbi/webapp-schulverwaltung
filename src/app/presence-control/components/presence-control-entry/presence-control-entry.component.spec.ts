import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { buildLessonPresence } from "src/spec-builders";
import {
  buildTestModuleMetadata,
  changeInput,
  settings,
} from "src/spec-helpers";
import { PresenceControlEntry } from "../../models/presence-control-entry.model";
import { PresenceControlEntryComponent } from "./presence-control-entry.component";
import { PresenceControlStateService } from "../../services/presence-control-state.service";
import { BehaviorSubject } from "rxjs";
import { PresenceControlViewMode } from "../../../shared/models/user-settings.model";

describe("PresenceControlEntryComponent", () => {
  let component: PresenceControlEntryComponent;
  let fixture: ComponentFixture<PresenceControlEntryComponent>;
  let element: HTMLElement;
  let stateServiceMock: PresenceControlStateService;
  let studyClassCount$: BehaviorSubject<number>;

  beforeEach(waitForAsync(() => {
    studyClassCount$ = new BehaviorSubject(0);

    stateServiceMock = {
      studyClassCount$,
    } as unknown as PresenceControlStateService;

    TestBed.configureTestingModule(
      buildTestModuleMetadata({
        declarations: [PresenceControlEntryComponent],
        providers: [
          {
            provide: PresenceControlStateService,
            useValue: stateServiceMock,
          },
        ],
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

    it("should show student name and incident action", () => {
      fixture.detectChanges();
      expect(element.textContent).toContain("Marie Curie");
      expect(element.textContent).toContain("presence-control.entry.incident");
    });

    it("should show study class name if lesson has two or more study classes", () => {
      studyClassCount$.next(2);
      fixture.detectChanges();
      expect(element.textContent).toContain("9a");
    });

    it("should not show study class name if lesson has only one study class", () => {
      studyClassCount$.next(1);
      fixture.detectChanges();
      expect(element.textContent).not.toContain("9a");
    });
  });

  describe("grid view", () => {
    beforeEach(() => {
      component.viewMode = PresenceControlViewMode.Grid;
    });

    it("should show student name and incident action", () => {
      fixture.detectChanges();
      expect(element.textContent).toContain("Marie Curie");
      expect(element.textContent).toContain("presence-control.entry.incident");
    });

    it("should never show study class in grid view", () => {
      studyClassCount$.next(1);
      fixture.detectChanges();
      expect(element.textContent).not.toContain("9a");

      studyClassCount$.next(2);
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
