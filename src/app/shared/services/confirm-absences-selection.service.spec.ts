import { TestBed } from "@angular/core/testing";
import { take } from "rxjs/operators";

import { buildTestModuleMetadata } from "src/spec-helpers";
import { buildLessonPresenceWithIds } from "src/spec-builders";
import { ConfirmAbsencesSelectionService } from "./confirm-absences-selection.service";
import { LessonPresence } from "src/app/shared/models/lesson-presence.model";
import { OpenAbsencesEntry } from "src/app/open-absences/models/open-absences-entry.model";

/* eslint-disable @typescript-eslint/no-explicit-any */

describe("ConfirmAbsencesSelectionService", () => {
  let service: ConfirmAbsencesSelectionService;
  let presenceA: LessonPresence;
  let presenceB: LessonPresence;
  let presenceC: LessonPresence;
  let presenceD: LessonPresence;
  let presenceE: LessonPresence;
  let entryA: OpenAbsencesEntry;
  let entryB: OpenAbsencesEntry;
  let entryC: OpenAbsencesEntry;

  beforeEach(() => {
    TestBed.configureTestingModule(
      buildTestModuleMetadata({ providers: [ConfirmAbsencesSelectionService] }),
    );
    service = TestBed.inject(ConfirmAbsencesSelectionService);

    presenceA = buildLessonPresenceWithIds(10, 21, 11);
    presenceB = buildLessonPresenceWithIds(11, 21, 11);
    presenceC = buildLessonPresenceWithIds(10, 22, 11);
    presenceD = buildLessonPresenceWithIds(12, 22, 11);
    presenceE = buildLessonPresenceWithIds(11, 22, 12);

    entryA = new OpenAbsencesEntry([presenceA, presenceB]);
    entryB = new OpenAbsencesEntry([presenceC, presenceD]);
    entryC = new OpenAbsencesEntry([presenceE]);
  });

  describe("selectedIds$", () => {
    it("emits ids for selected open absences entries (list)", () => {
      expectSelection([]);

      service.toggle(entryA);
      expectSelection([
        { personId: 21, presenceTypeId: 11, lessonIds: [10, 11] },
      ]);

      service.toggle(entryB);
      expectSelection([
        { personId: 21, presenceTypeId: 11, lessonIds: [10, 11] },
        { personId: 22, presenceTypeId: 11, lessonIds: [10, 12] },
      ]);

      service.clear();
      expectSelection([]);
    });

    it("emits ids for selected lesson presences (detail)", () => {
      expectSelection([]);

      service.toggle(presenceA);
      expectSelection([{ personId: 21, presenceTypeId: 11, lessonIds: [10] }]);

      service.toggle(presenceB);
      expectSelection([
        { personId: 21, presenceTypeId: 11, lessonIds: [10, 11] },
      ]);

      service.toggle(presenceC);
      expectSelection([
        { personId: 21, presenceTypeId: 11, lessonIds: [10, 11] },
        { personId: 22, presenceTypeId: 11, lessonIds: [10] },
      ]);

      service.clear();
      expectSelection([]);
    });
  });

  describe("selectedWithoutPresenceType$", () => {
    it("emits presences with default absence type for selected lesson presences", () => {
      expectSelectionWithoutPresenceType([]);

      service.toggle(presenceA);
      expectSelectionWithoutPresenceType([presenceA]);

      service.toggle(entryB);
      expectSelectionWithoutPresenceType([presenceC, presenceD, presenceA]);

      service.toggle(presenceE);
      expectSelectionWithoutPresenceType([presenceC, presenceD, presenceA]);

      service.toggle(entryC);
      expectSelectionWithoutPresenceType([presenceC, presenceD, presenceA]);

      service.clear();
      expectSelection([]);
    });
  });

  describe(".clearNonOpenAbsencesEntries", () => {
    it("clears the selected lesson presences", () => {
      service.toggle(entryA);
      service.toggle(presenceC);
      expectSelection([
        { personId: 21, presenceTypeId: 11, lessonIds: [10, 11] },
        { personId: 22, presenceTypeId: 11, lessonIds: [10] },
      ]);

      service.clearNonOpenAbsencesEntries();
      expectSelection([
        { personId: 21, presenceTypeId: 11, lessonIds: [10, 11] },
      ]);
    });

    it("does nothing if nothing is selected", () => {
      service.clearNonOpenAbsencesEntries();
      expectSelection([]);
    });
  });

  describe(".clearNonLessonPresences", () => {
    it("clears the selected lesson presences", () => {
      service.toggle(entryA);
      service.toggle(presenceC);
      expectSelection([
        { personId: 21, presenceTypeId: 11, lessonIds: [10, 11] },
        { personId: 22, presenceTypeId: 11, lessonIds: [10] },
      ]);

      service.clearNonLessonPresences();
      expectSelection([{ personId: 22, presenceTypeId: 11, lessonIds: [10] }]);
    });

    it("does nothing if nothing is selected", () => {
      service.clearNonLessonPresences();
      expectSelection([]);
    });
  });

  function expectSelection(expected: any): void {
    service.selectedIds$
      .pipe(take(1))
      .subscribe((selection) => expect(selection).toEqual(expected));
  }

  function expectSelectionWithoutPresenceType(expected: any): void {
    service.selectedWithoutPresenceType$
      .pipe(take(1))
      .subscribe((selection) => expect(selection).toEqual(expected));
  }
});
