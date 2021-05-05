import { extractLessonEntries, getCurrentLessonEntry } from './lesson-entries';
import { buildLesson, buildLessonPresence } from '../../../spec-builders';
import { fromLesson, LessonEntry } from './lesson-entry';
import { Lesson } from '../../shared/models/lesson.model';

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

  describe('getCurrentLessonEntry', () => {
    let lessons: LessonEntry[];
    let deutsch: Lesson;
    let math: Lesson;
    let singen: Lesson;
    let werken: Lesson;

    beforeEach(() => {
      deutsch = buildLesson(
        1,
        new Date(2000, 0, 23, 8, 0),
        new Date(2000, 0, 23, 9, 0),
        'Deutsch',
        `Dora Durrer`
      );
      math = buildLesson(
        2,
        new Date(2000, 0, 23, 9, 0),
        new Date(2000, 0, 23, 10, 0),
        'Mathematik',
        `Monika Muster`
      );
      singen = buildLesson(
        3,
        new Date(2000, 0, 23, 11, 0),
        new Date(2000, 0, 23, 12, 0),
        'Singen',
        'Sandra Schmid'
      );
      werken = buildLesson(
        4,
        new Date(2000, 0, 23, 13, 0),
        new Date(2000, 0, 23, 14, 0),
        'Werken',
        'Wanda Wehrli'
      );

      lessons = [
        fromLesson(deutsch),
        fromLesson(math),
        fromLesson(singen),
        fromLesson(werken),
      ];
    });

    describe('same day', () => {
      it('returns null if no lessons are present', () => {
        jasmine.clock().mockDate(new Date(2000, 0, 23, 12, 0));
        expect(getCurrentLessonEntry([])).toBeNull();
      });

      it('returns first lesson if time is before its start', () => {
        jasmine.clock().mockDate(new Date(2000, 0, 23, 6, 0));
        expect(getCurrentLessonEntry(lessons)).toEqual(fromLesson(deutsch));
      });

      it('returns last lesson if time is after its end', () => {
        jasmine.clock().mockDate(new Date(2000, 0, 23, 17, 0));
        expect(getCurrentLessonEntry(lessons)).toEqual(fromLesson(werken));
      });

      it('returns ongoing lesson if time is within', () => {
        jasmine.clock().mockDate(new Date(2000, 0, 23, 9, 30));
        expect(getCurrentLessonEntry(lessons)).toEqual(fromLesson(math));
      });

      it('returns ongoing lesson if the exactly equals lesson start', () => {
        jasmine.clock().mockDate(new Date(2000, 0, 23, 11, 0));
        expect(getCurrentLessonEntry(lessons)).toEqual(fromLesson(singen));
      });

      it('returns upcoming lesson if time is after a lesson and before another', () => {
        jasmine.clock().mockDate(new Date(2000, 0, 23, 10, 30));
        expect(getCurrentLessonEntry(lessons)).toEqual(fromLesson(singen));
      });
    });

    describe('day before', () => {
      beforeEach(() => {
        jasmine.clock().mockDate(new Date(2000, 0, 22, 12, 0));
      });

      it('returns first lesson', () => {
        expect(getCurrentLessonEntry(lessons)).toEqual(fromLesson(deutsch));
      });
    });

    describe('day after', () => {
      beforeEach(() => {
        jasmine.clock().mockDate(new Date(2000, 0, 24, 12, 0));
      });

      it('returns first lesson', () => {
        expect(getCurrentLessonEntry(lessons)).toEqual(fromLesson(deutsch));
      });
    });
  });
});
