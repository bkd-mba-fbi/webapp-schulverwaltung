import { TestBed } from '@angular/core/testing';

import { buildLessonPresenceWithIds } from 'src/spec-builders';
import { AbsencesSelectionService } from './absences-selection.service';
import { LessonPresence } from 'src/app/shared/models/lesson-presence.model';

describe('AbsencesSelectionService', () => {
  let service: AbsencesSelectionService;
  let presenceA: LessonPresence;
  let presenceB: LessonPresence;
  let presenceC: LessonPresence;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AbsencesSelectionService],
    });
    service = TestBed.inject(AbsencesSelectionService);

    presenceA = buildLessonPresenceWithIds(10, 21);
    presenceB = buildLessonPresenceWithIds(11, 21);
    presenceC = buildLessonPresenceWithIds(10, 22);
  });

  describe('selectedIds$', () => {
    it('emits ids of for selected entries', () => {
      const selectedIdsCallback = jasmine.createSpy('selectedIds$');
      service.selectedIds$.subscribe(selectedIdsCallback);

      expect(selectedIdsCallback).toHaveBeenCalledWith([]);

      service.toggle(presenceA);
      expect(selectedIdsCallback).toHaveBeenCalledWith([
        { personIds: [21], lessonIds: [10] },
      ]);

      selectedIdsCallback.calls.reset();
      service.toggle(presenceB);
      expect(selectedIdsCallback).toHaveBeenCalledWith([
        { personIds: [21], lessonIds: [10, 11] },
      ]);

      selectedIdsCallback.calls.reset();
      service.toggle(presenceC);
      expect(selectedIdsCallback).toHaveBeenCalledWith([
        { personIds: [21], lessonIds: [10, 11] },
        { personIds: [22], lessonIds: [10] },
      ]);

      selectedIdsCallback.calls.reset();
      service.clear();
      expect(selectedIdsCallback).toHaveBeenCalledWith([]);
    });
  });
});
