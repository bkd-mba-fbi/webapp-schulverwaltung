import { buildLessonPresenceWithIds } from 'src/spec-builders';
import { LessonPresence } from '../models/lesson-presence.model';
import {
  getIdsGroupedByPerson,
  getIdsGroupedByLesson,
} from './lesson-presences';

describe('lesson presences utils', () => {
  let presenceA: LessonPresence;
  let presenceB: LessonPresence;
  let presenceC: LessonPresence;

  beforeEach(() => {
    presenceA = buildLessonPresenceWithIds(10, 20);
    presenceB = buildLessonPresenceWithIds(10, 21);
    presenceC = buildLessonPresenceWithIds(11, 21);
  });

  describe('getIdsGroupedByPerson', () => {
    it('groups lesson ids by student ids', () => {
      const result = getIdsGroupedByPerson([presenceA, presenceB, presenceC]);
      expect(result).toEqual([
        { personIds: [20], lessonIds: [10] },
        { personIds: [21], lessonIds: [10, 11] },
      ]);
    });
  });

  describe('getIdsGroupedByLesson', () => {
    it('groups student ids by lesson ids', () => {
      const result = getIdsGroupedByLesson([presenceA, presenceB, presenceC]);
      expect(result).toEqual([
        { lessonIds: [10], personIds: [20, 21] },
        { lessonIds: [11], personIds: [21] },
      ]);
    });
  });
});
