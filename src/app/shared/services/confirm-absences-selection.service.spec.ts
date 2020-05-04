import { TestBed } from '@angular/core/testing';
import { take } from 'rxjs/operators';

import { buildTestModuleMetadata } from 'src/spec-helpers';
import { buildLessonPresenceWithIds } from 'src/spec-builders';
import { ConfirmAbsencesSelectionService } from './confirm-absences-selection.service';
import { LessonPresence } from 'src/app/shared/models/lesson-presence.model';
import { OpenAbsencesEntry } from 'src/app/open-absences/models/open-absences-entry.model';

describe('ConfirmAbsencesSelectionService', () => {
  let service: ConfirmAbsencesSelectionService;
  let presenceA: LessonPresence;
  let presenceB: LessonPresence;
  let presenceC: LessonPresence;
  let presenceD: LessonPresence;
  let entryA: OpenAbsencesEntry;
  let entryB: OpenAbsencesEntry;

  beforeEach(() => {
    TestBed.configureTestingModule(buildTestModuleMetadata({}));
    service = TestBed.inject(ConfirmAbsencesSelectionService);

    presenceA = buildLessonPresenceWithIds(10, 21);
    presenceB = buildLessonPresenceWithIds(11, 21);
    presenceC = buildLessonPresenceWithIds(10, 22);
    presenceD = buildLessonPresenceWithIds(12, 22);

    entryA = new OpenAbsencesEntry([presenceA, presenceB]);
    entryB = new OpenAbsencesEntry([presenceC, presenceD]);
  });

  describe('selectedIds$', () => {
    it('emits ids for selected open absences entries (list)', () => {
      expectSelection([]);

      service.toggle(entryA);
      expectSelection([{ personIds: [21], lessonIds: [10, 11] }]);

      service.toggle(entryB);
      expectSelection([
        { personIds: [21], lessonIds: [10, 11] },
        { personIds: [22], lessonIds: [10, 12] },
      ]);

      service.clear();
      expectSelection([]);
    });

    it('emits ids for selected lesson presences (detail)', () => {
      expectSelection([]);

      service.toggle(presenceA);
      expectSelection([{ personIds: [21], lessonIds: [10] }]);

      service.toggle(presenceB);
      expectSelection([{ personIds: [21], lessonIds: [10, 11] }]);

      service.toggle(presenceC);
      expectSelection([
        { personIds: [21], lessonIds: [10, 11] },
        { personIds: [22], lessonIds: [10] },
      ]);

      service.clear();
      expectSelection([]);
    });
  });

  describe('.clearNonOpenAbsencesEntries', () => {
    it('clears the selected lesson presences', () => {
      service.toggle(entryA);
      service.toggle(presenceC);
      expectSelection([
        { personIds: [21], lessonIds: [10, 11] },
        { personIds: [22], lessonIds: [10] },
      ]);

      service.clearNonOpenAbsencesEntries();
      expectSelection([{ personIds: [21], lessonIds: [10, 11] }]);
    });

    it('does nothing if nothing is selected', () => {
      service.clearNonOpenAbsencesEntries();
      expectSelection([]);
    });
  });

  describe('.clearNonLessonPresences', () => {
    it('clears the selected lesson presences', () => {
      service.toggle(entryA);
      service.toggle(presenceC);
      expectSelection([
        { personIds: [21], lessonIds: [10, 11] },
        { personIds: [22], lessonIds: [10] },
      ]);

      service.clearNonLessonPresences();
      expectSelection([{ personIds: [22], lessonIds: [10] }]);
    });

    it('does nothing if nothing is selected', () => {
      service.clearNonLessonPresences();
      expectSelection([]);
    });
  });

  function expectSelection(expected: any): void {
    service.selectedIds$
      .pipe(take(1))
      .subscribe((selection) => expect(selection).toEqual(expected));
  }
});
