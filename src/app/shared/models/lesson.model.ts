import { LessonPresence } from './lesson-presence.model';

export type Lesson = Pick<
  LessonPresence,
  | 'LessonRef'
  | 'EventDesignation'
  | 'EventRef'
  | 'StudyClassNumber'
  | 'TeacherInformation'
  | 'LessonDateTimeFrom'
  | 'LessonDateTimeTo'
>;
