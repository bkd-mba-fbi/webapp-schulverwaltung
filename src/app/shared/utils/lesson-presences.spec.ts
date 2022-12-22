import {
  buildLessonPresence,
  buildLessonPresenceWithIds,
} from 'src/spec-builders';
import { LessonPresence } from '../models/lesson-presence.model';
import {
  getIdsGroupedByPerson,
  getIdsGroupedByLesson,
  sortLessonPresencesByDate,
  getIdsGroupedByPersonAndPresenceType,
  toDesignationDateTimeTypeString,
} from './lesson-presences';

describe('lesson presences utils', () => {
  let presenceA: LessonPresence;
  let presenceB: LessonPresence;
  let presenceC: LessonPresence;
  let presenceD: LessonPresence;
  let presenceE: LessonPresence;

  beforeEach(() => {
    presenceA = buildLessonPresenceWithIds(10, 20, 11);
    presenceB = buildLessonPresenceWithIds(10, 21, 11);
    presenceC = buildLessonPresenceWithIds(11, 21, 11);
    presenceD = buildLessonPresenceWithIds(11, 20, 12);
    presenceE = buildLessonPresenceWithIds(12, 21, 12);
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

  describe('getIdsGroupedByPersonAndPresenceType', () => {
    it('groups lesson ids by student and presence type ids', () => {
      const result = getIdsGroupedByPersonAndPresenceType([
        presenceA,
        presenceB,
        presenceC,
        presenceD,
        presenceE,
      ]);
      expect(result).toEqual([
        { personId: 20, presenceTypeId: 11, lessonIds: [10] },
        { personId: 20, presenceTypeId: 12, lessonIds: [11] },
        { personId: 21, presenceTypeId: 11, lessonIds: [10, 11] },
        { personId: 21, presenceTypeId: 12, lessonIds: [12] },
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

  describe('sortLessonPresencesByDate', () => {
    it('sorts lesson presences by LessonDateTimeFrom attribute', () => {
      presenceA.LessonDateTimeFrom = new Date(2000, 1, 23, 12, 30);
      presenceB.LessonDateTimeFrom = new Date(2000, 1, 23, 9, 0);
      presenceC.LessonDateTimeFrom = new Date(2000, 1, 23, 12, 0);

      const result = sortLessonPresencesByDate([
        presenceA,
        presenceB,
        presenceC,
      ]);
      expect(result).toEqual([presenceB, presenceC, presenceA]);
    });
  });

  describe('toDesignationDateTimeTypeString', () => {
    it('returns the formatted information as string for the given lesson presence with missing type', () => {
      const presence = buildLessonPresence(
        1,
        new Date(2021, 3, 22, 9, 0),
        new Date(2021, 3, 22, 9, 45),
        'Deutsch-S1'
      );

      expect(toDesignationDateTimeTypeString(presence)).toBe(
        'Deutsch-S1, 22.04.2021, 09:00-09:45, '
      );
    });
  });
});
