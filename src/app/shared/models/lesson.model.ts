import { LessonPresence } from './lesson-presence.model';

export type Lesson = Pick<
  LessonPresence,
  | 'EventDesignation'
  | 'StudyClassNumber'
  | 'LessonDateTimeFrom'
  | 'LessonDateTimeTo'
>;
