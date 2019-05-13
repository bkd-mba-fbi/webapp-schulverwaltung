import { Reference } from './app/shared/models/common-types';
import { LessonPresence } from './app/shared/models/lesson-presence.model';
import { Lesson } from './app/shared/models/lesson.model';

export function buildReference(id = 123, href?: string): Reference {
  return { Id: id, Href: href || `/${id}` };
}

export function buildLessonPresence(
  lessonId: number,
  dateFrom: Date,
  dateTo: Date,
  eventDesignation: string,
  studentName = ''
): LessonPresence {
  return {
    LessonRef: buildReference(lessonId),
    StudentRef: buildReference(),
    EventRef: buildReference(),
    PresenceTypeRef: null,
    StudyClassRef: buildReference(),
    EventTypeId: 123,
    PresenceConfirmationState: null,
    PresenceConfirmationStateId: null,
    EventDesignation: eventDesignation,
    EventNumber: '',
    HasStudyCourseConfirmationCode: 0,
    IsReadOnly: 0,
    LessonDateTimeFrom: dateFrom,
    LessonDateTimeTo: dateTo,
    PresenceComment: null,
    PresenceDate: null,
    PresenceType: null,
    StudentFullName: studentName,
    StudyClassDesignation: '',
    StudyClassNumber: '9a',
    TeacherInformation: '',
    WasAbsentInPrecedingLesson: null,
    Href: ''
  };
}

export function buildLesson(
  lessonId: number,
  dateFrom: Date,
  dateTo: Date,
  eventDesignation: string
): Lesson {
  return {
    LessonRef: buildReference(lessonId),
    EventDesignation: eventDesignation,
    LessonDateTimeFrom: dateFrom,
    LessonDateTimeTo: dateTo,
    StudyClassNumber: '9a'
  };
}
