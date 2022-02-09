import * as t from 'io-ts';
import { LocalDateFromString, Option } from './common-types';
import { StudyClass } from './study-class.model';

const EvaluationStatusRef = t.intersection([
  t.type({
    Id: t.number,
  }),
  t.type({
    HRef: Option(t.string),
  }),
  t.partial({
    HasEvaluationStarted: t.boolean,
    EvaluationUntil: Option(LocalDateFromString),
    HasReviewOfEvaluationStarted: t.boolean,
    HasTestGrading: t.boolean,
    Id: t.number,
  }),
]);

const AttendanceRef = t.intersection([
  t.type({
    Id: t.number,
  }),
  t.type({
    HRef: Option(t.string),
  }),
  t.partial({
    Id: t.number,
    // EventId: t.number,
    StudentCount: t.number,
    // MaxStudents: t.number,
    // MinStudents: t.number,
  }),
]);

const Course = t.type({
  HRef: t.string,
  Id: t.number,
  Number: t.number,
  Designation: t.string,
  // HostId: t.string,
  // Host: t.string,
  // Management: t.string,
  // MaxParticipants: t.number,
  // MinParticipants: t.number,
  // Weekday: t.string,
  DateFrom: LocalDateFromString,
  DateTo: LocalDateFromString,
  // LessonFrequency: t.number,
  // Location: t.string,
  // TimeFrom: LocalDateTimeFromString,
  // TimeTo: LocalDateTimeFromString,
  // ConductOfCourse: null,
  // RegistrationFrom: null,
  // RegistrationTo: null,
  // Price: 0.0000,
  // Credits: 2.0,
  // LanguageOfInstruction: null,
  // Url: null,
  // Color: null,
  // IsPublished: t.boolean,
  // LevelId: t.number,
  // Level: t.string,
  // StatusId: t.number,
  // Status: t.string,
  // Lessons: null,
  // EventManagers: null,
  // MainEventManagers: null,
  // TimetableEntries: null,
  // GradingScaleId: t.number,
  // FinalGrades: null,
  // Gradings: null,
  // Tests: null,
  EvaluationStatusRef,
  AttendanceRef,
  // ParticipatingStudents: null,
  Classes: Option(t.array(StudyClass)),
});
type Course = t.TypeOf<typeof Course>;
export { Course };
