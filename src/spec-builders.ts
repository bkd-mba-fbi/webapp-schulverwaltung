import {
  EventEntry,
  EventState,
} from "./app/events/services/events-state.service";
import { PresenceControlEntry } from "./app/presence-control/models/presence-control-entry.model";
import { ApprenticeshipContract } from "./app/shared/models/apprenticeship-contract.model";
import { ApprenticeshipManager } from "./app/shared/models/apprenticeship-manager.model";
import { OptionalReference, Reference } from "./app/shared/models/common-types";
import {
  AttendanceRef,
  Course,
  EvaluationStatusRef,
  FinalGrading,
  Grading,
} from "./app/shared/models/course.model";
import { Event } from "./app/shared/models/event.model";
import { Grade } from "./app/shared/models/grading-scale.model";
import { JobTrainer } from "./app/shared/models/job-trainer.model";
import { LegalRepresentative } from "./app/shared/models/legal-representative.model";
import { LessonAbsence } from "./app/shared/models/lesson-absence.model";
import { LessonDispensation } from "./app/shared/models/lesson-dispensation.model";
import { LessonIncident } from "./app/shared/models/lesson-incident.model";
import { LessonPresenceStatistic } from "./app/shared/models/lesson-presence-statistic";
import { LessonPresence } from "./app/shared/models/lesson-presence.model";
import { Lesson } from "./app/shared/models/lesson.model";
import { Person, PersonSummary } from "./app/shared/models/person.model";
import { PresenceType } from "./app/shared/models/presence-type.model";
import {
  FinalGrade,
  GradeKind,
  GradeOrNoResult,
  StudentGrade,
} from "./app/shared/models/student-grades";
import { Student } from "./app/shared/models/student.model";
import { StudyClass } from "./app/shared/models/study-class.model";
import {
  Subscription,
  SubscriptionDetail,
} from "./app/shared/models/subscription.model";
import { Result, Test } from "./app/shared/models/test.model";
import { TimetableEntry } from "./app/shared/models/timetable-entry.model";
import { TokenPayload } from "./app/shared/models/token-payload.model";
import { UserSettings } from "./app/shared/models/user-settings.model";

/* eslint-disable @typescript-eslint/no-explicit-any */

export function buildReference(id = 123, href?: string): Reference {
  return { Id: id, HRef: href || `/${id}` };
}

export function buildOptionalReference(
  id: Option<number> = null,
): OptionalReference {
  return { Id: id, HRef: null };
}

export function buildLessonPresence(
  lessonId: number,
  dateFrom: Date,
  dateTo: Date,
  eventDesignation: string,
  studentName = "",
  teacherInformation = "",
  presenceTypeId?: number,
  eventRefId?: number,
  studentRefId?: number,
  confirmationStateId?: number,
): LessonPresence {
  return {
    Id: lessonId && studentRefId ? [lessonId, studentRefId].join("_") : "1",
    LessonRef: buildReference(lessonId),
    StudentRef: buildReference(studentRefId),
    EventRef: buildReference(eventRefId),
    TypeRef: buildOptionalReference(presenceTypeId),
    RegistrationRef: buildReference(),
    StudyClassRef: buildReference(),
    // EventTypeId: 123,
    // ConfirmationState: null,
    ConfirmationStateId: confirmationStateId || null,
    EventDesignation: eventDesignation,
    // EventNumber: '',
    HasStudyCourseConfirmationCode: false,
    // IsReadOnly: false,
    LessonDateTimeFrom: dateFrom,
    LessonDateTimeTo: dateTo,
    Comment: null,
    Date: null,
    Type: null,
    StudentFullName: studentName,
    // StudyClassDesignation: '',
    StudyClassNumber: "9a",
    TeacherInformation: teacherInformation,
  };
}

export function buildLessonPresenceWithIds(
  lessonId: number,
  studentId: number,
  presenceTypeId: number,
  dateFrom = new Date(),
  dateTo = new Date(),
): LessonPresence {
  const presence = buildLessonPresence(lessonId, dateFrom, dateTo, "");
  presence.StudentRef = buildReference(studentId);
  presence.TypeRef = buildReference(presenceTypeId);
  return presence;
}

export function buildLessonPresenceFromTimetableEntry(
  timetableEntry: TimetableEntry,
): LessonPresence {
  return {
    Id: "",
    LessonRef: { Id: timetableEntry.Id, HRef: null },
    StudentRef: { Id: 42, HRef: null },
    EventRef: { Id: 0, HRef: null },
    TypeRef: { Id: null, HRef: null },
    RegistrationRef: { Id: 0, HRef: null },
    StudyClassRef: { Id: 0, HRef: null },
    ConfirmationStateId: null,
    EventDesignation: timetableEntry.EventDesignation,
    HasStudyCourseConfirmationCode: false,
    LessonDateTimeFrom: timetableEntry.From,
    LessonDateTimeTo: timetableEntry.To,
    Comment: null,
    Date: timetableEntry.From,
    Type: null,
    StudentFullName: "",
    StudyClassNumber: "",
    TeacherInformation: timetableEntry.EventManagerInformation ?? null,
  };
}

export function buildLessonAbsence(id: string): LessonAbsence {
  return {
    Id: id,
    LessonRef: buildReference(),
    StudentRef: buildReference(),
    TypeRef: buildReference(),
    Type: null,
    ConfirmationState: null,
    ConfirmationStateId: 0,
    Comment: null,
    StudentFullName: "studentName",
    RegistrationId: 0,
    HRef: "",
  };
}

export function buildLessonDispensation(id: string): LessonDispensation {
  return {
    Id: id,
    LessonRef: buildReference(),
    StudentRef: buildReference(),
    TypeRef: buildReference(),
    Type: null,
    Comment: null,
    StudentFullName: "studentName",
    HRef: "",
  };
}

export function buildLessonIncident(): LessonIncident {
  return {
    LessonRef: buildReference(),
    StudentRef: buildReference(),
    TypeRef: buildReference(),
    Comment: null,
    StudentFullName: "",
    Type: null,
    RegistrationId: 0,
    HRef: "",
  };
}

export function buildLesson(
  lessonId: number,
  dateFrom: Date,
  dateTo: Date,
  eventDesignation: string,
  teacherInformation: string,
  studyClassNumber?: string,
  eventId?: number,
): Lesson {
  return {
    LessonRef: buildReference(lessonId),
    EventDesignation: eventDesignation,
    EventRef: buildReference(eventId),
    LessonDateTimeFrom: dateFrom,
    LessonDateTimeTo: dateTo,
    StudyClassNumber: studyClassNumber || "9a",
    TeacherInformation: teacherInformation,
  };
}

export function buildPresenceControlEntry(
  lessonPresence: LessonPresence,
  presenceType?: Option<PresenceType>,
  precedingAbsences?: ReadonlyArray<LessonAbsence>,
): PresenceControlEntry {
  return new PresenceControlEntry(
    lessonPresence,
    presenceType || null,
    precedingAbsences || [],
  );
}

export function buildPresenceType(
  id: number,
  isAbsence: boolean,
  isIncident: boolean,
  isComment = false,
): PresenceType {
  return {
    Id: id,
    // TypeId: id * 10,
    Active: true,
    // Description: '',
    Designation: "",
    IsAbsence: isAbsence,
    IsComment: isComment,
    IsDispensation: false,
    IsIncident: isIncident,
    IsHalfDay: false,
    NeedsConfirmation: true,
    Sort: 0,
  };
}

export function buildLessonPresenceStatistic(
  studentId: number,
): LessonPresenceStatistic {
  return {
    StudentRef: buildReference(studentId),
    StudentFullName: "Bachofner Roman",
    TotalAbsences: 0,
    TotalAbsencesUnconfirmed: 0,
    TotalAbsencesValidExcuse: 0,
    TotalAbsencesWithoutExcuse: 0,
    TotalAbsencesUnchecked: 0,
    TotalDispensations: 0,
    TotalHalfDays: 0,
    TotalIncidents: 0,
  };
}

export function buildStudent(id: number): Student {
  return {
    Id: id,
    AddressLine1: "",
    AddressLine2: null,
    Birthdate: null,
    DisplayEmail: "",
    FirstName: "T",
    FullName: "T. Tux",
    Gender: "F",
    LastName: "Tux",
    Location: "",
    PhoneMobile: "",
    PhonePrivate: "",
    PostalCode: "",
    // HRef: ''
  };
}

export function buildPersonSummary(id: number): PersonSummary {
  return {
    Id: id,
    FullName: "Tux",
    DisplayEmail: null,
    Email: null,
  };
}

export function buildApprenticeshipContract(
  id: number,
  jobTrainerId = 0,
  apprenticeshipManagerId = 0,
): ApprenticeshipContract {
  return {
    Id: id,
    JobTrainer: jobTrainerId,
    // StudentRef: buildReference(),
    ApprenticeshipManagerId: apprenticeshipManagerId,
    // ApprenticeshipDateFrom: '',
    // ApprenticeshipDateTo: '',
    // CompanyName: '',
    // CompanyNameAddition: null,
    ContractDateFrom: null,
    ContractDateTo: null,
    // ContractNumber: '',
    // ContractTermination: null,
    // ContractType: '',
    // JobCode: 123,
    // JobVersion: 1,
    // HRef: ''
  };
}

export function buildLegalRepresentative(
  id: number,
  representativeId?: number,
): LegalRepresentative {
  return {
    Id: id,
    // TypeId: '',
    RepresentativeId: representativeId || 0,
    // StudentId: 0,
    // DateFrom: null,
    // DateTo: null,
    RepresentativeAfterMajority: false,
  };
}

export function buildApprenticeshipManager(id: number): ApprenticeshipManager {
  return {
    // HRef: '',
    Email: "",
    Email2: null,
    PhoneBusiness: null,
    // PhoneMobile: null,
    CompanyName: "",
    CompanyNameAddition: null,
    Firstname: null,
    // MiddleName: null,
    Lastname: null,
    // FormOfAddress: null,
    // Gender: 'X',
    AddressLine1: undefined,
    AddressLine2: undefined,
    PostalCode: "",
    Location: "",
    // Country: null,
    // CountryId: '',
    // CorrespondenceAddress: null,
    // CorrespondencePersonId: 0,
    Id: id,
  };
}

export function buildJobTrainer(id: number): JobTrainer {
  return {
    // HRef: '',
    Email: null,
    Email2: null,
    PhoneBusiness: null,
    PhoneMobile: null,
    Firstname: "",
    // MiddleName: null,
    Lastname: "",
    // FormOfAddress: null,
    // Gender: 'X',
    // AddressLine1: undefined,
    // AddressLine2: undefined,
    // PostalCode: null,
    // Location: null,
    // Country: null,
    // CountryId: '',
    // CorrespondenceAddress: null,
    // CorrespondencePersonId: 0,
    Id: id,
  };
}

export function buildPayLoad(
  personId = "2431",
  instanceId = "GYmTEST",
): TokenPayload {
  return {
    culture_info: "de-CH",
    fullname: "Test Rudy",
    id_person: personId,
    holder_id: "",
    instance_id: instanceId,
    roles: "LessonTeacherRole;ClassTeacherRole",
    substitution_id: undefined,
  };
}

export function buildPerson(id: number): Person {
  return {
    Id: id,
    // Country: '',
    // CountryId: '',
    FormOfAddress: "Frau",
    // FormOfAddressId: 1,
    // HomeCountry: null,
    // HomeCountryId: null,
    Nationality: null,
    // NationalityId: null,
    AddressLine1: null,
    AddressLine2: null,
    BillingAddress: "",
    Birthdate: null,
    CorrespondenceAddress: "",
    DisplayEmail: null,
    Email: null,
    Email2: null,
    FirstName: "",
    Gender: "X",
    HomeTown: null,
    // IsEditable: false,
    // IsEmployee: false,
    LastName: "",
    FullName: "",
    Location: null,
    // MatriculationNumber: null,
    MiddleName: null,
    NativeLanguage: null,
    PhoneMobile: null,
    PhonePrivate: null,
    PhoneBusiness: null,
    // Profession: null,
    SocialSecurityNumber: null,
    StayPermit: null,
    StayPermitExpiry: null,
    Zip: null,
    // HRef: ''
  };
}

export function buildPersonWithEmails(
  id: number,
  displayEmail?: string,
  email?: string,
  email2?: string,
): Person {
  const person = buildPerson(id);
  person.DisplayEmail = displayEmail || null;
  person.Email = email;
  person.Email2 = email2;
  return person;
}

export function buildJobTrainerWithEmails(
  id: number,
  email: string,
  email2: Option<string> = null,
): JobTrainer {
  const trainer = buildJobTrainer(id);
  trainer.Email = email;
  trainer.Email2 = email2;
  return trainer;
}

export function buildApprenticeshipManagerWithEmails(
  id: number,
  email: string,
  email2: Option<string> = null,
): ApprenticeshipManager {
  const manager = buildApprenticeshipManager(id);
  manager.Email = email;
  manager.Email2 = email2;
  return manager;
}

export function buildUserSettings(
  settings: UserSettings["Settings"] = [],
): UserSettings {
  return {
    Id: "Cst",
    Settings: settings,
  };
}

export function buildUserSettingsWithNotificationSetting(
  gui: boolean,
  mail: boolean,
  phoneMobile: boolean,
): UserSettings {
  const setting = buildUserSettings();
  const notification = {
    Key: "notification",
    Value: JSON.stringify({ mail, gui, phoneMobile }),
  };
  return { ...setting, Settings: [notification] };
}

export function buildSubscriptionDetail(
  vssId: number,
  value?: string,
): SubscriptionDetail {
  return {
    Id: "1",
    SubscriptionId: 1,
    IdPerson: 1,
    VssId: vssId,
    VssType: "",
    Value: value || "",
    VssDesignation: "",
    VssStyle: "",
    EventId: 1,
    ShowAsRadioButtons: false,
    DropdownItems: [
      { Key: 1, Value: "item 1" },
      { Key: "2", Value: "item 2" },
    ],
  };
}

export function buildSubscription(
  id: number,
  eventId: number,
  personId: number,
): Subscription {
  return {
    Id: id,
    // CurrentWorkProgressId: "current-work-progress-id",
    EventId: eventId,
    PersonId: personId,
    Status: "closed",
    // StatusId: null,
    // IsOkay: null,
    // IsQueued: null,
    EventDesignation: null,
    // EventInformation: null,
    // EventNotes: null,
    // CheckPersonalInformation: null,
    // CorrespondencePersonId: null,
    // CorrespondenceAddressTypeId: null,
    // Billing1PersonId: null,
    // Billing1AddressTypeId: null,
    // Billing2PersonId: null,
    // Billing2AddressTypeId: null,
    // KindOfPaymentId1: null,
    // KindOfPaymentEmail1: null,
    // KindOfPaymentId2: null,
    // KindOfPaymentEmail2: null,
    // IdObject: null,
    // IdSubscription: null,
    // IdStatus: null,
    // AnsweredQuestions: null,
    // Messages: null,
    // SubscriptionDetails: null,
    RegistrationDate: null,
    // HRef: null,
  };
}

export function buildStudyClass(id: number, designation?: string): StudyClass {
  return {
    Id: id,
    Designation: designation || "22a",
    StudentCount: 0,
    Number: designation || "22a",
  };
}

export function buildEvent(id: number, designation?: string): Event {
  return {
    Id: id,
    // AreaOfEducation: t.string,
    // AreaOfEducationId: t.number,
    // EventCategory: t.string,
    // EventCategoryId: t.number,
    // EventLevel: t.string,
    // EventLevelId: t.number,
    // EventType: t.string,
    // EventTypeId: t.number,
    // Host: t.string,
    // HostId: t.string,
    // Status: t.string,
    // StatusId: t.number,
    // AllowSubscriptionByStatus: t.boolean,
    // AllowSubscriptionInternetByStatus: t.boolean,
    // DateFrom: null,
    // DateTo: null,
    Designation: designation || "Französisch-S2",
    // Duration: null,
    // FreeSeats: null,
    // HasQueue: t.boolean,
    // HighPrice: t.number,
    // LanguageOfInstruction: null,
    Leadership: null,
    // Location: null,
    // MaxParticipants: t.number,
    // MinParticipants: t.number,
    // Number: t.string,
    // Price: t.number,
    // StatusDate: null,
    // SubscriptionDateFrom: null,
    // SubscriptionDateTo: null,
    // SubscriptionTimeFrom: null,
    // SubscriptionTimeTo: null,
    // TimeFrom: null,
    // TimeTo: null,
    // TypeOfSubscription: t.number,
    // Weekday: null,
    // IdObject: t.number,
    // StatusText: null,
    // Management: null,
    // GradingScaleId: null,
    // DateString: t.string,
    StudentCount: 10,
    // HRef: t.string,
  };
}

export function buildCourse(
  id: number,
  designation?: string,
  attendance?: AttendanceRef,
  evaluationStatus?: EvaluationStatusRef,
  classes?: StudyClass[],
  statusId?: number,
): Course {
  return {
    HRef: "",
    Id: id,
    Number: "1",
    Designation: designation || "Physik-22a",
    // HostId: t.string,
    // Host: t.string,
    // Management: t.string,
    // MaxParticipants: t.number,
    // MinParticipants: t.number,
    // Weekday: t.string,
    DateFrom: new Date("2022-02-09T00:00:00"),
    DateTo: new Date("2022-06-30T00:00:00"),
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
    StatusId: statusId || 2,
    // Status: t.string,
    // Lessons: null,
    // EventManagers: null,
    // MainEventManagers: null,
    // TimetableEntries: null,
    GradingScaleId: 1105,
    FinalGrades: null,
    Gradings: null,
    Tests: null,
    EvaluationStatusRef: evaluationStatus || buildReference(),
    AttendanceRef: attendance || buildReference(),
    ParticipatingStudents: [buildStudent(100)],
    Classes: classes || null,
  };
}

export function buildTimetableEntry(
  id: number,
  from: Date,
  to: Date,
): TimetableEntry {
  return {
    Id: id,
    From: from,
    To: to,
    EventId: 0,
    EventNumber: "",
    EventDesignation: "",
    EventManagerInformation: "",
    EventLocation: "",
  };
}

export function buildEventEntry(id: number): EventEntry {
  return {
    designation: "Französisch-S2, 24a",
    detailLink: "",
    id: id,
    state: EventState.Tests,
    studentCount: 33,
  };
}

export function buildTest(
  courseId: number,
  testId: number,
  results: Result[] | null,
): Test {
  return {
    Id: testId,
    CourseId: courseId,
    Date: new Date("2022-02-09T00:00:00"),
    Designation: `Test Designation for test with id ${testId}`,
    Weight: 2,
    WeightPercent: 50,
    IsPointGrading: false,
    MaxPoints: 27,
    MaxPointsAdjusted: 0,
    IsPublished: false,
    IsOwner: true,
    Owner: null,
    // Creation: "2022-02-14T16:58:18.89",
    GradingScaleId: 1106,
    // GradingScale: "Zehntelnoten bes. disp. keine Note",
    Results: results,
  };
}

export function buildResult(
  testId: number,
  studentId: number,
  courseRegistrationId: number = 123456,
): Result {
  return {
    TestId: testId,
    CourseRegistrationId: courseRegistrationId,
    GradeId: 2349,
    GradeValue: 3.7,
    GradeDesignation: "3.7",
    Points: null,
    StudentId: studentId,
    Id: `${testId}_${courseRegistrationId}`,
  };
}

export function buildGrading(
  studentId: number,
  averageGrade: number = 2.275,
  gradeId: number = 3,
): Grading {
  return {
    AverageTestResult: averageGrade,
    CanGrade: false,
    // EventDesignation: "Französisch-S2",
    EventId: 9248,
    // EventNumber: "4-2-F-S2-GYM22-22a",
    // GradeComment: null,
    GradeId: gradeId,
    GradeValue: null,
    // HRef: '/restApi/Gradings/126885',
    Id: 126885,
    // StudentFullName: "Michel Franziska",
    StudentId: studentId,
    // StudentMatriculationNumber: null,
    // StudentNameTooltip: "Michel Franziska",
  };
}

export function buildGradingScale(id: number, grades: Grade[] = []) {
  return {
    Id: id,
    // Designation: "Zehntelnoten bes. disp. keine Note",
    // MinGrade: 0.0,
    // MaxGrade: 0.0,
    // CommentsAllowed: false,
    // LowestSufficientGrade: 4.0,
    // RisingGrades: true,
    Grades: grades,
    // IdObject: 1106,
    // FreeGrading: false,
    // HRef: "/restApi/GradingScales/1106",
  };
}

export function buildFinalGrading(id: number): FinalGrading {
  return {
    // EventId: 9457,
    // EventDesignation: "Französisch-S2",
    // EventNumber: "1-2-F-S2-GYM22-25a",
    StudentId: 6231,
    // StudentMatriculationNumber: null,
    // StudentFullName: "Scheidegger Mona",
    // StudentNameTooltip: "Scheidegger Mona",
    Grade: "4.5",
    // GradeValue: 4.5,
    AverageTestResult: 4.512,
    // IsAdequate: true,
    // GradeComment: null,
    Id: id,
  };
}

export function buildStudentGrade(
  student: Student,
  gradesOrNoResults: GradeOrNoResult[],
): StudentGrade {
  return {
    student: student,
    finalGrade: buildFinalGrade(),
    grades: gradesOrNoResults,
  };
}

export function buildGradeKind(
  kind: any,
  result: Result,
  test: Test,
): GradeKind {
  return {
    kind: kind,
    result: result,
    test: test,
  };
}

function buildFinalGrade(): FinalGrade {
  return {
    gradingId: 12,
    average: 4,
    gradeId: 20,
    finalGradeValue: "5.5",
    canGrade: true,
  };
}
