import { Lesson } from '../../shared/models/lesson.model';
import { LessonPresence } from '../../shared/models/lesson-presence.model';
import { lessonsEqual } from './lessons';

export function lessonsEntryEqual(
  a: Option<LessonEntry>,
  b: Option<LessonEntry | LessonPresence>
): boolean {
  return (
    (a === null && b === null) ||
    (a !== null &&
      b !== null &&
      a.TeacherInformation === b.TeacherInformation &&
      a.LessonDateTimeFrom.getTime() === b.LessonDateTimeFrom.getTime() &&
      a.LessonDateTimeTo.getTime() === b.LessonDateTimeTo.getTime())
  );
}

export function fromLesson(lesson: Lesson): LessonEntry {
  const entry = new LessonEntry(
    lesson.TeacherInformation,
    lesson.LessonDateTimeFrom,
    lesson.LessonDateTimeTo
  );
  entry.addLesson(lesson);
  return entry;
}

/**
 * Represents a grouping of Lessons by time/teacher.
 */
export class LessonEntry {
  readonly id: string;
  lessons = [] as Array<Lesson>;

  constructor(
    public TeacherInformation: string,
    public LessonDateTimeFrom: Date,
    public LessonDateTimeTo: Date
  ) {
    this.id = [
      // TODO hash?
      TeacherInformation.split(' ').join('-'),
      LessonDateTimeFrom.getTime(),
      LessonDateTimeTo.getTime(),
    ].join('-');
  }

  addLesson(lesson: Lesson): void {
    if (!this.lessons.some((l) => lessonsEqual(l, lesson))) {
      this.lessons.push(lesson);
    }
  }

  get studyClassNumbers(): string {
    return [
      ...new Set(this.lessons.map((l) => l.StudyClassNumber).sort()),
    ].join(', ');
  }

  get eventDesignations(): string {
    return [
      ...new Set(this.lessons.map((l) => l.EventDesignation).sort()),
    ].join(', ');
  }
}
