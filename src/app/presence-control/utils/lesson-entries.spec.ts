import { extractLessonEntries } from './lesson-entries';
import { buildLessonPresence } from '../../../spec-builders';
import { fromLesson } from './lesson-entry';

describe('lessons entries', () => {
  describe('extractLessonEntries', () => {
    it('returns a sorted array of unique lesson entries', () => {
      const result = extractLessonEntries([
        buildLessonPresence(
          1,
          new Date(2000, 0, 23, 9, 0),
          new Date(2000, 0, 23, 10, 0),
          'Mathematik'
        ),
        buildLessonPresence(
          2,
          new Date(2000, 0, 23, 8, 0),
          new Date(2000, 0, 23, 9, 0),
          'Deutsch'
        ),
        buildLessonPresence(
          2,
          new Date(2000, 0, 23, 8, 0),
          new Date(2000, 0, 23, 9, 0),
          'Deutsch'
        ),
        buildLessonPresence(
          3,
          new Date(2000, 0, 23, 10, 0),
          new Date(2000, 0, 23, 11, 0),
          'Mathematik'
        ),
      ]);

      const math1 = {
        LessonRef: { Id: 1, HRef: '/1' },
        EventDesignation: 'Mathematik',
        StudyClassNumber: '9a',
        TeacherInformation: '',
        LessonDateTimeFrom: new Date(2000, 0, 23, 9, 0),
        LessonDateTimeTo: new Date(2000, 0, 23, 10, 0),
      };

      const deutsch2 = {
        LessonRef: { Id: 2, HRef: '/2' },
        EventDesignation: 'Deutsch',
        StudyClassNumber: '9a',
        TeacherInformation: '',
        LessonDateTimeFrom: new Date(2000, 0, 23, 8, 0),
        LessonDateTimeTo: new Date(2000, 0, 23, 9, 0),
      };

      const math3 = {
        LessonRef: { Id: 3, HRef: '/3' },
        EventDesignation: 'Mathematik',
        StudyClassNumber: '9a',
        TeacherInformation: '',
        LessonDateTimeFrom: new Date(2000, 0, 23, 10, 0),
        LessonDateTimeTo: new Date(2000, 0, 23, 11, 0),
      };

      expect(result).toEqual([
        fromLesson(deutsch2),
        fromLesson(math1),
        fromLesson(math3),
      ]);
    });

    it('returns empty array for empty array', () => {
      expect(extractLessonEntries([])).toEqual([]);
    });
  });
});
