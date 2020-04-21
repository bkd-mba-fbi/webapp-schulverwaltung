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
  presenceTypeId?: number,
  eventRefId?: number,
  studentRefId?: number,
  confirmationStateId?: number
): LessonPresence {
  return {
    Id: '1',
    LessonRef: buildReference(lessonId),
    StudentRef: buildReference(studentRefId),
    EventRef: buildReference(eventRefId),
    TypeRef: buildOptionalReference(presenceTypeId),
    // StudyClassRef: buildReference(),
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
    // TeacherInformation: '',
    WasAbsentInPrecedingLesson: null
  };
}

export function buildLessonPresenceWithIds(
  lessonId: number,
  studentId: number,
  dateFrom = new Date(),
  dateTo = new Date()
): LessonPresence {
  const presence = buildLessonPresence(lessonId, dateFrom, dateTo, '');
  presence.StudentRef = buildReference(studentId);
  return presence;
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

export function buildPresenceControlEntry(
  lessonPresence: LessonPresence,
  presenceType?: Option<PresenceType>
): PresenceControlEntry {
  return new PresenceControlEntry(lessonPresence, presenceType || null);
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
    Sort: 0
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
    TotalIncidents: 0
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
    PostalCode: ''
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
    CompanyName: '',
    ContractDateFrom: null,
    ContractDateTo: null
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
    RepresentativeId: representativeId || 0
    // StudentId: 0,
    // DateFrom: null,
    // DateTo: null,
    // RepresentativeAfterMajority: false
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
    // FormOfAddress: 'Frau',
    // FormOfAddressId: 1,
    // HomeCountry: null,
    // HomeCountryId: null,
    // Nationality: null,
    // NationalityId: null,
    AddressLine1: null,
    AddressLine2: null,
    // BillingAddress: '',
    // Birthdate: null,
    // CorrespondenceAddress: '',
    DisplayEmail: null,
    // Email: null,
    // Email2: null,
    FirstName: '',
    Gender: 'X',
    // HomeTown: null,
    // IsEditable: false,
    // IsEmployee: false,
    LastName: '',
    Location: null,
    // MatriculationNumber: null,
    // MiddleName: null,
    // NativeLanguage: null,
    PhoneMobile: null,
    PhonePrivate: null,
    PhoneBusiness: null,
    // Profession: null,
    // SocialSecurityNumber: null,
    // StayPermit: null,
    // StayPermitExpiry: null,
    Zip: null
    // HRef: ''
  };
}
