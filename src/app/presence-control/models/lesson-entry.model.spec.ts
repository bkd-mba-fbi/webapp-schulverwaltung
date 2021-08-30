import { fromLesson, lessonsEntryEqual } from './lesson-entry.model';
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

  describe('.fromLesson', () => {
    it('returns a new lesson entry from a given lesson', () => {
      const lesson = buildLesson(
        3,
        new Date(2000, 0, 23, 11),
        new Date(2000, 0, 23, 12),
        'Deutsch',
        'Dora Durrer',
        'D4b',
        333
      );

      const lessonEntry = fromLesson(lesson);

      expect(lessonEntry.TeacherInformation).toBe('Dora Durrer');
      expect(lessonEntry.LessonDateTimeFrom).toEqual(lesson.LessonDateTimeFrom);
      expect(lessonEntry.LessonDateTimeTo).toEqual(lesson.LessonDateTimeTo);
      expect(lessonEntry.id).toEqual('3');
      expect(lessonEntry.eventId).toEqual(333);
      expect(lessonEntry.eventDesignations).toBe('Deutsch');
      expect(lessonEntry.studyClassNumbers).toBe('D4b');
      expect(lessonEntry.lessons).toContain(lesson);
    });

    it('return a new lesson entry from the given lessons', () => {
      const deutsch1 = buildLesson(
        1,
        new Date(2000, 0, 23, 11),
        new Date(2000, 0, 23, 12),
        'Deutsch I',
        'Dora Durrer',
        '9a',
        333
      );

      const deutsch2 = buildLesson(
        2,
        new Date(2000, 0, 23, 11),
        new Date(2000, 0, 23, 12),
        'Deutsch II',
        'Dora Durrer',
        '9B',
        333
      );

      const lessonEntry = fromLesson(deutsch1);
      lessonEntry.addLesson(deutsch2);

      expect(lessonEntry.TeacherInformation).toBe('Dora Durrer');
      expect(lessonEntry.LessonDateTimeFrom).toEqual(
        deutsch1.LessonDateTimeFrom
      );
      expect(lessonEntry.LessonDateTimeTo).toEqual(deutsch1.LessonDateTimeTo);
      expect(lessonEntry.id).toEqual('1-2');
      expect(lessonEntry.eventId).toEqual(333);
      expect(lessonEntry.eventDesignations).toBe('Deutsch I, Deutsch II');
      expect(lessonEntry.studyClassNumbers).toBe('9a, 9B');
      expect(lessonEntry.lessons).toContain(deutsch1, deutsch2);
    });
  });
});
