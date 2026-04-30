import { ComponentFixture, TestBed } from "@angular/core/testing";
import { BehaviorSubject, of } from "rxjs";
import { LessonPresence } from "src/app/shared/models/lesson-presence.model";
import { Lesson } from "src/app/shared/models/lesson.model";
import { PresenceType } from "src/app/shared/models/presence-type.model";
import { BkdModalService } from "src/app/shared/services/bkd-modal.service";
import { LessonPresencesUpdateService } from "src/app/shared/services/lesson-presences-update.service";
import {
  buildLesson,
  buildLessonPresence,
  buildPresenceType,
  buildReference,
} from "src/spec-builders";
import { buildTestModuleMetadata, settings } from "src/spec-helpers";
import { PresenceControlEntry } from "../../models/presence-control-entry.model";
import { PresenceControlBlockLessonService } from "../../services/presence-control-block-lesson.service";
import { PresenceControlGroupService } from "../../services/presence-control-group.service";
import { PresenceControlStateService } from "../../services/presence-control-state.service";
import { PresenceControlListComponent } from "./presence-control-list.component";

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

  let presenceControlEntries$: BehaviorSubject<PresenceControlEntry[]>;
  let presenceControlEntriesByGroup$: BehaviorSubject<PresenceControlEntry[]>;
  let stateServiceMock: PresenceControlStateService;
  let groupServiceMock: PresenceControlGroupService;
  let blockLessonServiceMock: jasmine.SpyObj<PresenceControlBlockLessonService>;
  let lessonPresencesUpdateServiceMock: LessonPresencesUpdateService;
  let modalServiceMock: jasmine.SpyObj<BkdModalService>;
  let modalRefMock: {
    componentInstance: Record<string, unknown>;
    result: Promise<ReadonlyArray<PresenceControlEntry>>;
  };

  beforeEach(async () => {
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
      updateLessonPresencesTypes: jasmine.createSpy(
        "updateLessonPresencesTypes",
      ),
    } as unknown as PresenceControlStateService;

    groupServiceMock = {
      group$: of(null),
    } as unknown as PresenceControlGroupService;

    blockLessonServiceMock = jasmine.createSpyObj(
      "PresenceControlBlockLessonService",
      ["getBlockLessonPresenceControlEntries"],
    );

    modalRefMock = {
      componentInstance: {},
      result: Promise.resolve([]),
    };
    modalServiceMock = jasmine.createSpyObj("BkdModalService", ["open"]);
    modalServiceMock.open.and.returnValue(
      modalRefMock as unknown as ReturnType<BkdModalService["open"]>,
    );

    lessonPresencesUpdateServiceMock = {
      updatePresenceType: jasmine
        .createSpy("updatePresenceType")
        .and.callFake(
          (
            entryOrEntries:
              | PresenceControlEntry
              | ReadonlyArray<PresenceControlEntry>,
            presenceTypeId: number | null,
          ) => {
            const entries = Array.isArray(entryOrEntries)
              ? entryOrEntries
              : [entryOrEntries];
            return of(
              entries.map((e) => ({
                presence: e.lessonPresence,
                newPresenceTypeId: presenceTypeId,
              })),
            );
          },
        ),
    } as unknown as LessonPresencesUpdateService;

    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        imports: [PresenceControlListComponent],
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
          { provide: BkdModalService, useValue: modalServiceMock },
        ],
      }),
    ).compileComponents();
  });

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

  describe(".togglePresenceType", () => {
    describe("single lesson entry", () => {
      beforeEach(() => {
        blockLessonServiceMock.getBlockLessonPresenceControlEntries.and.returnValue(
          of([bichsel]),
        );
      });

      it("updates given entry without showing block lesson dialog", () => {
        component.togglePresenceType(bichsel);
        expect(
          lessonPresencesUpdateServiceMock.updatePresenceType,
        ).toHaveBeenCalledWith([bichsel], absence.Id);
        expect(
          stateServiceMock.updateLessonPresencesTypes,
        ).toHaveBeenCalledWith([
          { presence: bichsel.lessonPresence, newPresenceTypeId: absence.Id },
        ]);
      });
    });

    describe("block lesson entry", () => {
      let bichsel2: PresenceControlEntry;

      beforeEach(() => {
        bichsel2 = buildPresenceControlEntry("Bichsel Peter");
        bichsel2.lessonPresence.LessonRef.Id = 2;
        blockLessonServiceMock.getBlockLessonPresenceControlEntries.and.returnValue(
          of([bichsel, bichsel2]),
        );
      });

      it("updates given entries to next presence type (showing block lesson dialog) if they have equal presence types", async () => {
        modalRefMock.result = Promise.resolve([bichsel, bichsel2]);
        component.togglePresenceType(bichsel);
        await modalRefMock.result;
        expect(
          lessonPresencesUpdateServiceMock.updatePresenceType,
        ).toHaveBeenCalledWith([bichsel, bichsel2], absence.Id);
        expect(
          stateServiceMock.updateLessonPresencesTypes,
        ).toHaveBeenCalledWith([
          { presence: bichsel.lessonPresence, newPresenceTypeId: absence.Id },
          { presence: bichsel2.lessonPresence, newPresenceTypeId: absence.Id },
        ]);
      });

      it("updates only current entry to next presence type (without showing block lesson dialog) if they have different presence types", () => {
        bichsel2.presenceType = absence;
        bichsel2.lessonPresence.TypeRef = buildReference(absence.Id);

        component.togglePresenceType(bichsel);
        expect(
          lessonPresencesUpdateServiceMock.updatePresenceType,
        ).toHaveBeenCalledWith([bichsel], absence.Id);
        expect(
          stateServiceMock.updateLessonPresencesTypes,
        ).toHaveBeenCalledWith([
          { presence: bichsel.lessonPresence, newPresenceTypeId: absence.Id },
        ]);
      });
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
