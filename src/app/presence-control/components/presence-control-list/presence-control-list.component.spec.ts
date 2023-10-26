import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { of, BehaviorSubject } from "rxjs";

import { buildTestModuleMetadata, settings } from "src/spec-helpers";
import {
  buildLessonPresence,
  buildLesson,
  buildPresenceType,
} from "src/spec-builders";
import { PresenceControlListComponent } from "./presence-control-list.component";
import { PresenceControlHeaderComponent } from "../presence-control-header/presence-control-header.component";
import { PresenceControlStateService } from "../../services/presence-control-state.service";
import { PresenceControlEntryComponent } from "../presence-control-entry/presence-control-entry.component";
import { PresenceControlEntry } from "../../models/presence-control-entry.model";
import { Lesson } from "src/app/shared/models/lesson.model";
import { LessonPresencesUpdateService } from "src/app/shared/services/lesson-presences-update.service";
import { PresenceType } from "src/app/shared/models/presence-type.model";
import { LessonPresence } from "src/app/shared/models/lesson-presence.model";
import { PresenceControlBlockLessonService } from "../../services/presence-control-block-lesson.service";
import { PresenceControlGroupService } from "../../services/presence-control-group.service";

describe("PresenceControlListComponent", () => {
  let component: PresenceControlListComponent;
  let fixture: ComponentFixture<PresenceControlListComponent>;
  let element: HTMLElement;

  let lesson: Lesson;
  let bichsel: PresenceControlEntry;
  let frisch: PresenceControlEntry;
  let jenni: PresenceControlEntry;
  let absence: PresenceType;
  let blockLessons: Array<LessonPresence>;
  let lessonPresence: LessonPresence;

  let presenceControlEntries$: BehaviorSubject<PresenceControlEntry[]>;
  let presenceControlEntriesByGroup$: BehaviorSubject<PresenceControlEntry[]>;
  let stateServiceMock: PresenceControlStateService;
  let groupServiceMock: PresenceControlGroupService;
  let blockLessonServiceMock: jasmine.SpyObj<PresenceControlBlockLessonService>;
  let lessonPresencesUpdateServiceMock: LessonPresencesUpdateService;

  beforeEach(waitForAsync(() => {
    lesson = buildLesson(
      1,
      new Date(2000, 0, 23, 8, 0),
      new Date(2000, 0, 23, 9, 0),
      "Deutsch",
      "Dora Durrer",
    );
    bichsel = buildPresenceControlEntry("Bichsel Peter");
    frisch = buildPresenceControlEntry("Frisch Max");
    jenni = buildPresenceControlEntry("Zoë Jenny");
    presenceControlEntries$ = new BehaviorSubject([bichsel, frisch, jenni]);

    presenceControlEntriesByGroup$ = presenceControlEntries$;

    absence = buildPresenceType(2, true, false);
    blockLessons = [jenni.lessonPresence];

    lessonPresence = buildLessonPresence(
      2,
      new Date(2000, 0, 23, 8, 0),
      new Date(2000, 0, 23, 9, 0),
      "Deutsch",
      "Einstein Albert",
      "Dora Durrer",
      absence.Id,
    );

    stateServiceMock = {
      loading$: of(false),
      lessons$: of([lesson]),
      selectedLesson$: of(lesson),
      presenceControlEntries$,
      presenceControlEntriesByGroup$,
      getNextPresenceType: jasmine
        .createSpy("getNextPresenceType")
        .and.callFake(() => of(absence)),
      getBlockLessonPresenceControlEntries: jasmine
        .createSpy("getBlockLessonPresenceControlEntries")
        .and.callFake(() => of(blockLessons)),
      hasUnconfirmedAbsences: () => of(false),
      viewMode$: of(),
      loadGroupsAvailability: jasmine
        .createSpy("loadGroupsAvailability")
        .and.callFake(() => of(false)),
      setDate: jasmine.createSpy("setDate"),
      setLessonId: jasmine.createSpy("setLessonId"),
      setViewMode: jasmine.createSpy("setViewMode"),
    } as unknown as PresenceControlStateService;

    groupServiceMock = {
      group$: of(null),
    } as unknown as PresenceControlGroupService;

    blockLessonServiceMock = jasmine.createSpyObj(
      "PresenceControlBlockLessonService",
      ["getBlockLessonPresenceControlEntries"],
    );

    lessonPresencesUpdateServiceMock = {
      updatePresenceType: jasmine.createSpy("updatePresenceType"),
    } as unknown as LessonPresencesUpdateService;

    TestBed.configureTestingModule(
      buildTestModuleMetadata({
        declarations: [
          PresenceControlListComponent,
          PresenceControlHeaderComponent,
          PresenceControlEntryComponent,
        ],
        providers: [
          {
            provide: PresenceControlStateService,
            useValue: stateServiceMock,
          },
          { provide: PresenceControlGroupService, useValue: groupServiceMock },
          {
            provide: PresenceControlBlockLessonService,
            useValue: blockLessonServiceMock,
          },
          {
            provide: LessonPresencesUpdateService,
            useValue: lessonPresencesUpdateServiceMock,
          },
        ],
      }),
    ).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PresenceControlListComponent);
    component = fixture.componentInstance;
    element = fixture.debugElement.nativeElement;

    fixture.detectChanges();
  });

  describe(".presenceControlEntries$", () => {
    it("emits all entries initially", () => {
      expect(getRenderedStudentNames()).toEqual([
        "Bichsel Peter",
        "Frisch Max",
        "Zoë Jenny",
      ]);
    });

    it("renders matching entries after search and applies search to new entries", () => {
      component.search$.next("fri");
      fixture.detectChanges();
      expect(getRenderedStudentNames()).toEqual(["Frisch Max"]);

      presenceControlEntries$.next([
        bichsel,
        frisch,
        buildPresenceControlEntry("Frisch Peter"),
        jenni,
      ]);
      fixture.detectChanges();
      expect(getRenderedStudentNames()).toEqual(["Frisch Max", "Frisch Peter"]);
    });
  });

  describe(".doTogglePresenceType", () => {
    beforeEach(() => {
      blockLessonServiceMock.getBlockLessonPresenceControlEntries.and.returnValue(
        of([bichsel]),
      );
    });

    it("updates given entry without block lesson dialog", () => {
      bichsel.lessonPresence = lessonPresence;
      component.togglePresenceType(bichsel);
      expect(
        lessonPresencesUpdateServiceMock.updatePresenceType,
      ).toHaveBeenCalledWith(bichsel, absence.Id);
    });

    it("updates given entry to next presence type", () => {
      component.doTogglePresenceType([bichsel]);
      expect(
        lessonPresencesUpdateServiceMock.updatePresenceType,
      ).toHaveBeenCalledWith(bichsel, absence.Id);
    });
  });

  function getRenderedStudentNames(): string[] {
    return Array.prototype.slice
      .call(element.querySelectorAll(".default-entries .student-name"))
      .map((e) => e.textContent.trim());
  }

  function buildPresenceControlEntry(
    studentName: string,
  ): PresenceControlEntry {
    const presenceControlEntry = new PresenceControlEntry(
      buildLessonPresence(
        lesson.LessonRef.Id,
        lesson.LessonDateTimeFrom,
        lesson.LessonDateTimeTo,
        lesson.EventDesignation,
        studentName,
      ),
      null,
      null,
    );

    Object.defineProperty(presenceControlEntry, "settings", {
      get: () => settings,
    });
    return presenceControlEntry;
  }
});
