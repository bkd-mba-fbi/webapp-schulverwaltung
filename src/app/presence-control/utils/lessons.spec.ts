import { buildLessonPresence, buildLesson } from '../../../spec-builders';
import { Lesson } from '../../shared/models/lesson.model';
import {
  lessonsEqual,
  extractLesson,
  extractLessons,
  getLessonPresencesForLesson,
  getCurrentLesson,
} from './lessons';

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
        'Mathematik'
      );
      expect(lessonsEqual(null, lesson)).toBe(false);
      expect(lessonsEqual(lesson, null)).toBe(false);
    });

    it('returns true for same object', () => {
      const lesson = buildLesson(
        1,
        new Date(2000, 0, 23, 9, 0),
        new Date(2000, 0, 23, 10, 0),
        'Mathematik'
      );
      expect(lessonsEqual(lesson, lesson)).toBe(true);
    });

    it('returns true for different objects with same id', () => {
      const lesson1 = buildLesson(
        1,
        new Date(2000, 0, 23, 9, 0),
        new Date(2000, 0, 23, 10, 0),
        'Mathematik'
      );
      const lesson2 = buildLesson(
        1,
        new Date(2000, 0, 23, 9, 0),
        new Date(2000, 0, 23, 10, 0),
        'Mathematik'
      );
      expect(lessonsEqual(lesson1, lesson2)).toBe(true);
    });

    it('returns false for different objects with different ids', () => {
      const lesson1 = buildLesson(
        1,
        new Date(2000, 0, 23, 9, 0),
        new Date(2000, 0, 23, 10, 0),
        'Mathematik'
      );
      const lesson2 = buildLesson(
        2,
        new Date(2000, 0, 23, 9, 0),
        new Date(2000, 0, 23, 10, 0),
        'Mathematik'
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

  describe('extractLessons', () => {
    it('returns a sorted array of unique lessons', () => {
      const result = extractLessons([
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
      expect(result).toEqual([
        {
          LessonRef: { Id: 2, HRef: '/2' },
          EventDesignation: 'Deutsch',
          StudyClassNumber: '9a',
          TeacherInformation: '',
          LessonDateTimeFrom: new Date(2000, 0, 23, 8, 0),
          LessonDateTimeTo: new Date(2000, 0, 23, 9, 0),
        },
        {
          LessonRef: { Id: 1, HRef: '/1' },
          EventDesignation: 'Mathematik',
          StudyClassNumber: '9a',
          TeacherInformation: '',
          LessonDateTimeFrom: new Date(2000, 0, 23, 9, 0),
          LessonDateTimeTo: new Date(2000, 0, 23, 10, 0),
        },
        {
          LessonRef: { Id: 3, HRef: '/3' },
          EventDesignation: 'Mathematik',
          StudyClassNumber: '9a',
          TeacherInformation: '',
          LessonDateTimeFrom: new Date(2000, 0, 23, 10, 0),
          LessonDateTimeTo: new Date(2000, 0, 23, 11, 0),
        },
      ]);
    });

    it('returns empty array for empty array', () => {
      expect(extractLessons([])).toEqual([]);
    });
  });

  describe('getCurrentLesson', () => {
    let lessons: Lesson[];
    let deutsch: Lesson;
    let math: Lesson;
    let singen: Lesson;
    let werken: Lesson;

    beforeEach(() => {
      deutsch = buildLesson(
        1,
        new Date(2000, 0, 23, 8, 0),
        new Date(2000, 0, 23, 9, 0),
        'Deutsch'
      );
      math = buildLesson(
        2,
        new Date(2000, 0, 23, 9, 0),
        new Date(2000, 0, 23, 10, 0),
        'Mathematik'
      );
      singen = buildLesson(
        3,
        new Date(2000, 0, 23, 11, 0),
        new Date(2000, 0, 23, 12, 0),
        'Singen'
      );
      werken = buildLesson(
        4,
        new Date(2000, 0, 23, 13, 0),
        new Date(2000, 0, 23, 14, 0),
        'Werken'
      );

      lessons = [deutsch, math, singen, werken];
    });

    describe('same day', () => {
      it('returns null if no lessons are present', () => {
        jasmine.clock().mockDate(new Date(2000, 0, 23, 12, 0));
        expect(getCurrentLesson([])).toBeNull();
      });

      it('returns first lesson if time is before its start', () => {
        jasmine.clock().mockDate(new Date(2000, 0, 23, 6, 0));
        expect(getCurrentLesson(lessons)).toBe(deutsch);
      });

      it('returns last lesson if time is after its end', () => {
        jasmine.clock().mockDate(new Date(2000, 0, 23, 17, 0));
        expect(getCurrentLesson(lessons)).toBe(werken);
      });

      it('returns ongoing lesson if time is within', () => {
        jasmine.clock().mockDate(new Date(2000, 0, 23, 9, 30));
        expect(getCurrentLesson(lessons)).toBe(math);
      });

      it('returns ongoing lesson if the exactly equals lesson start', () => {
        jasmine.clock().mockDate(new Date(2000, 0, 23, 11, 0));
        expect(getCurrentLesson(lessons)).toBe(singen);
      });

      it('returns upcoming lesson if time is after a lesson and before another', () => {
        jasmine.clock().mockDate(new Date(2000, 0, 23, 10, 30));
        expect(getCurrentLesson(lessons)).toBe(singen);
      });
    });

    describe('day before', () => {
      beforeEach(() => {
        jasmine.clock().mockDate(new Date(2000, 0, 22, 12, 0));
      });

      it('returns first lesson', () => {
        expect(getCurrentLesson(lessons)).toBe(deutsch);
      });
    });

    describe('day after', () => {
      beforeEach(() => {
        jasmine.clock().mockDate(new Date(2000, 0, 24, 12, 0));
      });

      it('returns first lesson', () => {
        expect(getCurrentLesson(lessons)).toBe(deutsch);
      });
    });
  });

  describe('getLessonPresencesForLesson', () => {
    beforeEach(() => {});

    it('returns lesson presences of given lesson, alphabetically sorted by student name', () => {
      const result = getLessonPresencesForLesson(
        buildLesson(
          2,
          new Date(2000, 0, 23, 8, 0),
          new Date(2000, 0, 23, 9, 0),
          'Deutsch'
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
