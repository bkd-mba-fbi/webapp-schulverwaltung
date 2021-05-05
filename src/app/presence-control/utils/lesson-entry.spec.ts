import { fromLesson, lessonsEntryEqual } from './lesson-entry';
import { buildLesson } from '../../../spec-builders';

describe('lessons entry', () => {
  describe('.lessonsEntryEqual', () => {
    it('returns true if the entries are equal', () => {
      const math1 = fromLesson(
        buildLesson(
          1,
          new Date(2000, 0, 23, 9),
          new Date(2000, 0, 23, 10),
          'Math I',
          'Monika Muster'
        )
      );

      const math2 = fromLesson(
        buildLesson(
          2,
          new Date(2000, 0, 23, 9),
          new Date(2000, 0, 23, 10),
          'Math II',
          'Monika Muster'
        )
      );

      expect(lessonsEntryEqual(math1, math2)).toBeTruthy();
    });
  });

  describe('.lessonsEntryEqual', () => {
    it('return a new lesson entry from a given lesson', () => {
      const lesson = buildLesson(
        3,
        new Date(2000, 0, 23, 11),
        new Date(2000, 0, 23, 12),
        'Deutsch',
        'Dora Durrer'
      );

      expect(fromLesson(lesson).TeacherInformation).toBe(
        lesson.TeacherInformation
      );
      expect(fromLesson(lesson).LessonDateTimeFrom).toEqual(
        lesson.LessonDateTimeFrom
      );
      expect(fromLesson(lesson).LessonDateTimeTo).toEqual(
        lesson.LessonDateTimeTo
      );

      expect(fromLesson(lesson).lessons).toContain(lesson);
    });
  });
});
