import { Lesson } from '../../shared/models/lesson.model';
import { LessonPresence } from '../../shared/models/lesson-presence.model';
import { lessonsEqual } from '../utils/lessons';

export function lessonsEntryEqual(
  a: Option<LessonEntry>,
  b: Option<LessonEntry | LessonPresence | Lesson>,
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
    lesson.LessonDateTimeTo,
  );
  entry.addLesson(lesson);
  return entry;
}

/**
 * Represents a grouping of Lessons by time/teacher.
 */
export class LessonEntry {
  readonly id: string;
  readonly studyClassNumbers: string;
  readonly eventDesignations: string;

  lessons = [] as Array<Lesson>;

  constructor(
    public TeacherInformation: string,
    public LessonDateTimeFrom: Date,
    public LessonDateTimeTo: Date,
  ) {}

  addLesson(lesson: Lesson): void {
    if (!this.lessons.some((l) => lessonsEqual(l, lesson))) {
      this.lessons.push(lesson);
      this.updateId();
      this.updateStudyClassNumbers();
      this.updateEventDesignations();
    }
  }

  getIds(): ReadonlyArray<number> {
    return [...new Set(this.lessons.map((l) => l.LessonRef.Id))];
  }

  getEventIds(): ReadonlyArray<number> {
    return [...new Set(this.lessons.map((l) => l.EventRef.Id))];
  }

  private updateId(): void {
    (this.id as string) = [
      ...new Set(this.lessons.map((l) => l.LessonRef.Id).sort()),
    ].join('-');
  }

  private updateStudyClassNumbers(): void {
    (this.studyClassNumbers as string) = [
      ...new Set(
        this.lessons
          .map((l) => l.StudyClassNumber)
          .sort((a, b) => a.localeCompare(b)),
      ),
    ].join(', ');
  }

  private updateEventDesignations(): void {
    (this.eventDesignations as string) = [
      ...new Set(this.lessons.map((l) => l.EventDesignation).sort()),
    ].join(', ');
  }
}
