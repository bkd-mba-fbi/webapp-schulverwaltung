import { Reference, OptionalReference } from './app/shared/models/common-types';
import { LessonPresence } from './app/shared/models/lesson-presence.model';
import { Lesson } from './app/shared/models/lesson.model';
import { PresenceType } from './app/shared/models/presence-type.model';
import { PresenceControlEntry } from './app/presence-control/models/presence-control-entry.model';
import { Student } from './app/shared/models/student.model';
import { ApprenticeshipContract } from './app/shared/models/apprenticeship-contract.model';
import { LegalRepresentative } from './app/shared/models/legal-representative.model';
import { Person } from './app/shared/models/person.model';
import { LessonPresenceStatistic } from './app/shared/models/lesson-presence-statistic';
import { ApprenticeshipManager } from './app/shared/models/apprenticeship-manager.model';
import { JobTrainer } from './app/shared/models/job-trainer.model';
import { UserSetting } from './app/shared/models/user-setting.model';
import { LessonAbsence } from './app/shared/models/lesson-absence.model';
import { SubscriptionDetail } from './app/shared/models/subscription-detail.model';
import { Course } from './app/shared/models/course.model';
import { Result, Test } from './app/shared/models/test.model';
/*import { TokenPayload } from './app/shared/models/token-payload.model';*/

export function buildReference(id = 123, href?: string): Reference {
  return { Id: id, HRef: href || `/${id}` };
}

export function buildOptionalReference(
  id: Option<number> = null
): OptionalReference {
  return { Id: id, HRef: null };
}

export function buildLessonPresence(
  lessonId: number,
  dateFrom: Date,
  dateTo: Date,
  eventDesignation: string,
  studentName = '',
  teacherInformation = '',
  presenceTypeId?: number,
  eventRefId?: number,
  studentRefId?: number,
  confirmationStateId?: number
): LessonPresence {
  return {
    Id: lessonId && studentRefId ? [lessonId, studentRefId].join('_') : '1',
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
    StudyClassNumber: '9a',
    TeacherInformation: teacherInformation,
  };
}

export function buildLessonPresenceWithIds(
  lessonId: number,
  studentId: number,
  presenceTypeId: number,
  dateFrom = new Date(),
  dateTo = new Date()
): LessonPresence {
  const presence = buildLessonPresence(lessonId, dateFrom, dateTo, '');
  presence.StudentRef = buildReference(studentId);
  presence.TypeRef = buildReference(presenceTypeId);
  return presence;
}

export function buildLesson(
  lessonId: number,
  dateFrom: Date,
  dateTo: Date,
  eventDesignation: string,
  teacherInformation: string,
  studyClassNumber?: string,
  eventId?: number
): Lesson {
  return {
    LessonRef: buildReference(lessonId),
    EventDesignation: eventDesignation,
    EventRef: buildReference(eventId),
    LessonDateTimeFrom: dateFrom,
    LessonDateTimeTo: dateTo,
    StudyClassNumber: studyClassNumber || '9a',
    TeacherInformation: teacherInformation,
  };
}

export function buildPresenceControlEntry(
  lessonPresence: LessonPresence,
  presenceType?: Option<PresenceType>,
  precedingAbsences?: ReadonlyArray<LessonAbsence>
): PresenceControlEntry {
  return new PresenceControlEntry(
    lessonPresence,
    presenceType || null,
    precedingAbsences || []
  );
}

export function buildPresenceType(
  id: number,
  isAbsence: boolean,
  isIncident: boolean,
  isComment = false
): PresenceType {
  return {
    Id: id,
    // TypeId: id * 10,
    Active: true,
    // Description: '',
    Designation: '',
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
  studentId: number
): LessonPresenceStatistic {
  return {
    StudentRef: buildReference(studentId),
    StudentFullName: 'Bachofner Roman',
    TotalAbsences: 0,
    TotalAbsencesUnconfirmed: 0,
    TotalAbsencesValidExcuse: 0,
    TotalAbsencesWithoutExcuse: 0,
    TotalDispensations: 0,
    TotalHalfDays: 0,
    TotalIncidents: 0,
  };
}

export function buildStudent(id: number): Student {
  return {
    Id: id,
    AddressLine1: '',
    AddressLine2: null,
    Birthdate: new Date('2002-07-10T00:00:00'),
    DisplayEmail: '',
    // FirstName: '',
    FullName: '',
    Gender: 'F',
    // LastName: '',
    Location: '',
    PhoneMobile: '',
    PhonePrivate: '',
    PostalCode: '',
    // HRef: ''
  };
}

export function buildApprenticeshipContract(
  id: number,
  jobTrainerId = 0,
  apprenticeshipManagerId = 0
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
  representativeId?: number
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
    Email: '',
    Email2: null,
    PhoneBusiness: null,
    // PhoneMobile: null,
    CompanyName: '',
    CompanyNameAddition: null,
    Firstname: null,
    // MiddleName: null,
    Lastname: null,
    // FormOfAddress: null,
    // Gender: 'X',
    AddressLine1: undefined,
    AddressLine2: undefined,
    PostalCode: '',
    Location: '',
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
    Firstname: '',
    // MiddleName: null,
    Lastname: '',
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

/*
export function buildPayLoad(): TokenPayload {
  return {
    culture_info: 'de-CH',
    fullname: 'Test Rudy',
    id_person: 2431,
    instance_id: 'GYmTEST',
    roles: 'LessonTeacherRole;ClassTeacherRole'
  };
}*/

export function buildPerson(id: number): Person {
  return {
    Id: id,
    // Country: '',
    // CountryId: '',
    FormOfAddress: 'Frau',
    // FormOfAddressId: 1,
    // HomeCountry: null,
    // HomeCountryId: null,
    Nationality: null,
    // NationalityId: null,
    AddressLine1: null,
    AddressLine2: null,
    BillingAddress: '',
    Birthdate: null,
    CorrespondenceAddress: '',
    DisplayEmail: null,
    Email: null,
    Email2: null,
    FirstName: '',
    Gender: 'X',
    HomeTown: null,
    // IsEditable: false,
    // IsEmployee: false,
    LastName: '',
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
  email2?: string
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
  email2: Option<string> = null
): JobTrainer {
  const trainer = buildJobTrainer(id);
  trainer.Email = email;
  trainer.Email2 = email2;
  return trainer;
}

export function buildApprenticeshipManagerWithEmails(
  id: number,
  email: string,
  email2: Option<string> = null
): ApprenticeshipManager {
  const manager = buildApprenticeshipManager(id);
  manager.Email = email;
  manager.Email2 = email2;
  return manager;
}

export function buildUserSetting(): UserSetting {
  return {
    Id: 'Cst',
    Settings: [],
  };
}

export function buildUserSettingWithNotificationSetting(
  gui: boolean,
  mail: boolean,
  phoneMobile: boolean
): UserSetting {
  const setting = buildUserSetting();
  const notification = {
    Key: 'notification',
    Value: JSON.stringify({ mail, gui, phoneMobile }),
  };
  setting.Settings.push(notification);
  return setting;
}

export function buildUserSettingWithNotificationData(
  id: number,
  subject: string,
  body: string
): UserSetting {
  const setting = buildUserSetting();
  const notification = {
    Key: 'notificationData',
    Value: JSON.stringify([{ id, subject, body }]),
  };
  setting.Settings.push(notification);
  return setting;
}

export function buildSubscriptionDetail(
  vssId: number,
  value?: string
): SubscriptionDetail {
  return {
    Id: '1',
    SubscriptionId: 1,
    IdPerson: 1,
    VssId: vssId,
    Value: value || '',
    EventId: 1,
    ShowAsRadioButtons: false,
    DropdownItems: null,
  };
}

export function buildCourse(id: number): Course {
  return {
    HRef: '',
    Id: id,
    Number: '1',
    Designation: '',
    // HostId: t.string,
    // Host: t.string,
    // Management: t.string,
    // MaxParticipants: t.number,
    // MinParticipants: t.number,
    // Weekday: t.string,
    DateFrom: new Date('2022-02-09T00:00:00'),
    DateTo: new Date('2022-06-30T00:00:00'),
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
    Tests: null,
    EvaluationStatusRef: buildReference(),
    AttendanceRef: buildReference(),
    ParticipatingStudents: [buildStudent(100)],
    Classes: null,
  };
}

export function buildTest(
  courseId: number,
  testId: number,
  results: Result[]
): Test {
  return {
    Id: testId,
    CourseId: courseId,
    Date: '2022-02-09T00:00:00',
    Designation: `Test Designation for test with id ${testId}`,
    Weight: 100,
    WeightPercent: 100,
    IsPointGrading: false,
    MaxPoints: false,
    MaxPointsAdjusted: false,
    IsPublished: false,
    IsOwner: true,
    // Owner: null,
    Creation: '2022-02-14T16:58:18.89',
    GradingScaleId: 1106,
    GradingScale: 'Zehntelnoten bes. disp. keine Note',
    Results: results,
  };
}

export function buildResult(testId: number, studentId: number): Result {
  return {
    TestId: testId,
    GradeId: 2349,
    GradeValue: 3.7,
    GradeDesignation: '3.7',
    Points: null,
    StudentId: studentId,
    Id: `${testId}_126713`,
  };
}
