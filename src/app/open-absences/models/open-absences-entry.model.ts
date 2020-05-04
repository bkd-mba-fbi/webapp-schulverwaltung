import { startOfDay, format } from 'date-fns';
import { LessonPresence } from 'src/app/shared/models/lesson-presence.model';
import { Searchable } from 'src/app/shared/utils/search';

/**
 * Represents a grouping of LessonPresences by day/student. Make sure
 * you'll only instantiate it for absences on the same day and the
 * same student (may be multiple lessons).
 */
export class OpenAbsencesEntry implements Searchable {
  readonly date: Date;
  readonly dateString: string;
  readonly studentId: number;
  readonly studentFullName: string;
  readonly studyClassNumber: string;
  readonly lessonsCount: number;

  constructor(public absences: ReadonlyArray<LessonPresence>) {
    if (absences.length === 0) {
      throw new Error('Absences array is empty');
    }
    this.date = startOfDay(this.absences[0].LessonDateTimeFrom);
    this.dateString = format(this.date, 'yyyy-MM-dd');
    this.studentId = this.absences[0].StudentRef.Id;
    this.studentFullName = this.absences[0].StudentFullName;
    this.studyClassNumber = this.absences[0].StudyClassNumber;
    this.lessonsCount = this.absences.length;
  }
}
