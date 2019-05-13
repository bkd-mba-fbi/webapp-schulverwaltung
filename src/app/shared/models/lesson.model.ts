import { LessonPresence } from './lesson-presence.model';

export type Lesson = Pick<
  LessonPresence,
  | 'LessonRef'
  | 'EventDesignation'
  | 'StudyClassNumber'
  | 'LessonDateTimeFrom'
  | 'LessonDateTimeTo'
>;
