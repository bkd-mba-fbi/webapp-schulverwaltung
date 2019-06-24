import { OpenAbsencesEntry } from './open-absences-entry.model';
import { LessonPresence } from 'src/app/shared/models/lesson-presence.model';
import { buildLessonPresenceWithIds } from 'src/spec-builders';

describe('OpenAbsencesEntry', () => {
  let presenceA: LessonPresence;
  let presenceB: LessonPresence;

  beforeEach(() => {
    presenceA = buildLessonPresenceWithIds(10, 21, new Date(2000, 0, 23, 12));
    presenceB = buildLessonPresenceWithIds(11, 21, new Date(2000, 0, 23, 13));
    [presenceA, presenceB].forEach(
      p => (p.StudentFullName = 'Albert Einstein')
    );

    jasmine.clock().install();
    jasmine.clock().mockDate(new Date(2000, 0, 23, 8, 30));
  });

  afterEach(() => jasmine.clock().uninstall());

  it('throws an execption if initialized with an empty array', () => {
    expect(() => new OpenAbsencesEntry([])).toThrow(
      new Error('Absences array is empty')
    );
  });

  it('is initialized for a list of absences of the same student', () => {
    const entry = new OpenAbsencesEntry([presenceA, presenceB]);
    expect(entry.date).toEqual(new Date(2000, 0, 23));
    expect(entry.dateString).toBe('2000-01-23');
    expect(entry.daysDifference).toBe(0);
    expect(entry.studentId).toBe(21);
    expect(entry.studentFullName).toBe('Albert Einstein');
    expect(entry.lessonsCount).toBe(2);
    expect(entry.absences).toEqual([presenceA, presenceB]);
  });

  it('handles date in the past', () => {
    presenceA.LessonDateTimeFrom = new Date(2000, 0, 1, 12);
    presenceB.LessonDateTimeFrom = new Date(2000, 0, 1, 13);
    const entry = new OpenAbsencesEntry([presenceA, presenceB]);
    expect(entry.daysDifference).toBe(-22);
  });

  it('handles date in the future', () => {
    presenceA.LessonDateTimeFrom = new Date(2000, 0, 24, 12);
    presenceB.LessonDateTimeFrom = new Date(2000, 0, 24, 13);
    const entry = new OpenAbsencesEntry([presenceA, presenceB]);
    expect(entry.daysDifference).toBe(1);
  });
});
