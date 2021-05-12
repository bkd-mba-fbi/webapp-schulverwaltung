import { buildLessonPresence, buildLesson } from '../../../spec-builders';
import {
  lessonsEqual,
  extractLesson,
  getLessonPresencesForLesson,
} from './lessons';
import { fromLesson } from '../models/lesson-entry.model';

describe('lessons utils', () => {
  beforeEach(() => jasmine.clock().install());
  afterEach(() => jasmine.clock().uninstall());

  describe('lessonsEqual', () => {
    it('returns true for null', () => {
      expect(lessonsEqual(null, null)).toBe(true);
    });

    it('returns false for one null', () => {
      const lesson = buildLesson(
        1,
        new Date(2000, 0, 23, 9, 0),
        new Date(2000, 0, 23, 10, 0),
        'Mathematik',
        `Monika Muster`
      );
      expect(lessonsEqual(null, lesson)).toBe(false);
      expect(lessonsEqual(lesson, null)).toBe(false);
    });

    it('returns true for same object', () => {
      const lesson = buildLesson(
        1,
        new Date(2000, 0, 23, 9, 0),
        new Date(2000, 0, 23, 10, 0),
        'Mathematik',
        `Monika Muster`
      );
      expect(lessonsEqual(lesson, lesson)).toBe(true);
    });

    it('returns true for different objects with same teacher and time', () => {
      const lesson1 = buildLesson(
        1,
        new Date(2000, 0, 23, 9, 0),
        new Date(2000, 0, 23, 10, 0),
        'Mathematik',
        `Monika Muster`
      );
      const lesson2 = buildLesson(
        1,
        new Date(2000, 0, 23, 9, 0),
        new Date(2000, 0, 23, 10, 0),
        'Mathematik',
        `Monika Muster`
      );
      expect(lessonsEqual(lesson1, lesson2)).toBe(true);
    });

    it('returns false for different objects with different teachers', () => {
      const lesson1 = buildLesson(
        1,
        new Date(2000, 0, 23, 9, 0),
        new Date(2000, 0, 23, 10, 0),
        'Mathematik',
        `Monika Muster`
      );
      const lesson2 = buildLesson(
        2,
        new Date(2000, 0, 23, 9, 0),
        new Date(2000, 0, 23, 10, 0),
        'Deutsch',
        `Dora Durrer`
      );
      expect(lessonsEqual(lesson1, lesson2)).toBe(false);
    });

    it('returns false for different objects with different times', () => {
      const lesson1 = buildLesson(
        1,
        new Date(2000, 0, 23, 9, 0),
        new Date(2000, 0, 23, 10, 0),
        'Mathematik',
        `Monika Muster`
      );
      const lesson2 = buildLesson(
        2,
        new Date(2000, 0, 23, 10, 0),
        new Date(2000, 0, 23, 11, 0),
        'Mathematik',
        `Monika Muster`
      );
      expect(lessonsEqual(lesson1, lesson2)).toBe(false);
    });
  });

  describe('extractLesson', () => {
    it('returns lesson for lesson presence', () => {
      const result = extractLesson(
        buildLessonPresence(
          1,
          new Date(2000, 0, 23, 9, 0),
          new Date(2000, 0, 23, 10, 0),
          'Mathematik'
        )
      );
      expect(result).toEqual({
        LessonRef: { Id: 1, HRef: '/1' },
        EventDesignation: 'Mathematik',
        StudyClassNumber: '9a',
        TeacherInformation: '',
        LessonDateTimeFrom: new Date(2000, 0, 23, 9, 0),
        LessonDateTimeTo: new Date(2000, 0, 23, 10, 0),
      });
    });
  });

  describe('getLessonPresencesForLesson', () => {
    beforeEach(() => {});

    it('returns lesson presences of given lesson, alphabetically sorted by student name', () => {
      const result = getLessonPresencesForLesson(
        fromLesson(
          buildLesson(
            2,
            new Date(2000, 0, 23, 8, 0),
            new Date(2000, 0, 23, 9, 0),
            'Deutsch',
            'Dora Durrer'
          )
        ),
        [
          buildLessonPresence(
            2,
            new Date(2000, 0, 23, 8, 0),
            new Date(2000, 0, 23, 9, 0),
            'Deutsch',
            'Max Frisch'
          ),
          buildLessonPresence(
            2,
            new Date(2000, 0, 23, 8, 0),
            new Date(2000, 0, 23, 9, 0),
            'Deutsch',
            'Einstein Albert'
          ),
          buildLessonPresence(
            1,
            new Date(2000, 0, 23, 9, 0),
            new Date(2000, 0, 23, 10, 0),
            'Mathematik',
            'Einstein Albert'
          ),
          buildLessonPresence(
            3,
            new Date(2000, 0, 23, 10, 0),
            new Date(2000, 0, 23, 11, 0),
            'Mathematik',
            'Einstein Albert'
          ),
        ]
      );
      expect(result.length).toEqual(2);
      expect(result.map((p) => p.StudentFullName)).toEqual([
        'Einstein Albert',
        'Max Frisch',
      ]);
    });

    it('returns empty array if lesson is null', () => {
      const result = getLessonPresencesForLesson(null, [
        buildLessonPresence(
          2,
          new Date(2000, 0, 23, 8, 0),
          new Date(2000, 0, 23, 9, 0),
          'Deutsch',
          'Max Frisch'
        ),
      ]);
      expect(result).toEqual([]);
    });
  });
});
