import { TestBed } from '@angular/core/testing';

import { buildLessonPresenceWithIds } from 'src/spec-builders';
import { OpenAbsencesEntriesSelectionService } from './open-absences-entries-selection.service';
import { OpenAbsencesEntry } from '../models/open-absences-entry.model';

describe('OpenAbsencesEntriesSelectionService', () => {
  let service: OpenAbsencesEntriesSelectionService;
  let entryA: OpenAbsencesEntry;
  let entryB: OpenAbsencesEntry;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OpenAbsencesEntriesSelectionService]
    });
    service = TestBed.get(OpenAbsencesEntriesSelectionService);

    entryA = new OpenAbsencesEntry([
      buildLessonPresenceWithIds(10, 21),
      buildLessonPresenceWithIds(11, 21)
    ]);

    entryB = new OpenAbsencesEntry([
      buildLessonPresenceWithIds(10, 22),
      buildLessonPresenceWithIds(12, 22)
    ]);
  });

  describe('selectedIds$', () => {
    it('emits ids of for selected entries', () => {
      const selectedIdsCallback = jasmine.createSpy('selectedIds$');
      service.selectedIds$.subscribe(selectedIdsCallback);

      expect(selectedIdsCallback).toHaveBeenCalledWith([]);

      service.toggle(entryA);
      expect(selectedIdsCallback).toHaveBeenCalledWith([
        { personIds: [21], lessonIds: [10, 11] }
      ]);

      selectedIdsCallback.calls.reset();
      service.toggle(entryB);
      expect(selectedIdsCallback).toHaveBeenCalledWith([
        { personIds: [21], lessonIds: [10, 11] },
        { personIds: [22], lessonIds: [10, 12] }
      ]);

      selectedIdsCallback.calls.reset();
      service.clear();
      expect(selectedIdsCallback).toHaveBeenCalledWith([]);
    });
  });
});
