import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { of } from "rxjs";
import { PresenceControlEntry } from "src/app/presence-control/models/presence-control-entry.model";
import { buildLessonPresence } from "src/spec-builders";
import { buildTestModuleMetadata, settings } from "src/spec-helpers";
import { EditAbsencesStateService } from "../../services/edit-absences-state.service";
import { EditAbsencesListComponent } from "./edit-absences-list.component";

describe("EditAbsencesListComponent", () => {
  let fixture: ComponentFixture<EditAbsencesListComponent>;
  let element: HTMLElement;
  let stateServiceMock: EditAbsencesStateService;

  beforeEach(waitForAsync(() => {
    const entry = buildPresenceControlEntry();
    stateServiceMock = {
      loading$: of(false),
      loadingPage$: of(false),
      entries$: of([entry.lessonPresence]),
      presenceControlEntries$: of([entry]),
      selected: [],
      setFilter: jasmine.createSpy("setFilter"),
      isFilterValid$: of(true),
      validFilter$: of({}),
      presenceTypes$: of([]),
      absenceConfirmationStates$: of([]),
    } as unknown as EditAbsencesStateService;

    TestBed.configureTestingModule(
      buildTestModuleMetadata({
        imports: [EditAbsencesListComponent],
        providers: [
          { provide: EditAbsencesStateService, useValue: stateServiceMock },
        ],
      }),
    ).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditAbsencesListComponent);
    element = fixture.debugElement.nativeElement;
    fixture.detectChanges();
  });

  it("should show the result table", () => {
    expect(element.querySelectorAll("table").length).toBe(1);
  });
});

function buildPresenceControlEntry(): PresenceControlEntry {
  const presenceControlEntry = new PresenceControlEntry(
    buildLessonPresence(
      5837_4508,
      new Date("2019-08-12T14:35:00"),
      new Date("2019-08-12T15:20:00"),
      "2-1-Biologie-MNW-2019/20-22a",
    ),
    null,
    null,
  );

  Object.defineProperty(presenceControlEntry, "settings", {
    get: () => settings,
  });
  return presenceControlEntry;
}
