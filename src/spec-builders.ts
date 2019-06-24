import { Reference, Flag } from './app/shared/models/common-types';
import { LessonPresence } from './app/shared/models/lesson-presence.model';
import { Lesson } from './app/shared/models/lesson.model';
import { PresenceType } from './app/shared/models/presence-type.model';
import { PresenceControlEntry } from './app/presence-control/models/presence-control-entry.model';
import { Student } from './app/shared/models/student.model';
import { ApprenticeshipContract } from './app/shared/models/apprenticeship-contract.model';
import { LegalRepresentative } from './app/shared/models/legal-representative.model';
import { Person } from './app/shared/models/person.model';

export function buildReference(id = 123, href?: string): Reference {
  return { Id: id, Href: href || `/${id}` };
}

export function buildLessonPresence(
  lessonId: number,
  dateFrom: Date,
  dateTo: Date,
  eventDesignation: string,
  studentName = '',
  presenceTypeId?: number
): LessonPresence {
  return {
    LessonRef: buildReference(lessonId),
    StudentRef: buildReference(),
    EventRef: buildReference(),
    PresenceTypeRef: buildReference(presenceTypeId),
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
  typeId: number,
  isAbsence: Flag,
  isIncident: Flag
): PresenceType {
  return {
    Id: id,
    TypeId: typeId,
    Active: 1,
    Description: '',
    Designation: '',
    IsAbsence: isAbsence,
    IsComment: 0,
    IsDispensation: 0,
    IsIncident: isIncident,
    IsHalfDay: 0,
    NeedsConfirmation: 1,
    Sort: 1,
    Href: ''
  };
}

export function buildStudent(id: number): Student {
  return {
    Id: id,
    AddressLine1: '',
    AddressLine2: null,
    Birthdate: new Date(),
    DisplayEmail: '',
    FirstName: '',
    FullName: '',
    Gender: 'F',
    LastName: '',
    Location: '',
    PhoneMobile: '',
    PhonePrivate: '',
    PostalCode: '',
    Href: ''
  };
}

export function buildApprenticeshipContract(
  id: number,
  jobTrainerId?: number,
  apprenticeshipManagerId = 0
): ApprenticeshipContract {
  return {
    Id: id,
    JobTrainerRef: buildReference(jobTrainerId),
    StudentRef: buildReference(),
    ApprenticeshipManagerId: apprenticeshipManagerId,
    ApprenticeshipDateFrom: '',
    ApprenticeshipDateTo: '',
    CompanyName: '',
    ContractDateFrom: null,
    ContractDateTo: null,
    ContractNumber: '',
    ContractTermination: null,
    ContractType: '',
    JobCode: 123,
    JobVersion: 1,
    Href: ''
  };
}

export function buildLegalRepresentative(
  id: number,
  representativeId?: number
): LegalRepresentative {
  return {
    Id: id,
    RepresentativeRef: buildReference(representativeId),
    StudentRef: buildReference(),
    DateFrom: null,
    DateTo: null,
    RepresentativeAfterMajority: 0,
    Href: ''
  };
}

export function buildPerson(id: number): Person {
  return {
    Id: id,
    Country: '',
    CountryId: '',
    FormOfAddress: 'Frau',
    FormOfAddressId: 1,
    HomeCountry: null,
    HomeCountryId: null,
    Nationality: null,
    NationalityId: null,
    AddressLine1: null,
    AddressLine2: null,
    BillingAddress: '',
    Birthdate: null,
    CorrespondenceAddress: '',
    DisplayEmail: null,
    Email: null,
    Email2: null,
    FirstName: '',
    Gender: 'F',
    HomeTown: null,
    IsEditable: false,
    IsEmployee: false,
    LastName: '',
    Location: null,
    MatriculationNumber: null,
    MiddleName: null,
    NativeLanguage: null,
    PhoneMobile: null,
    PhonePrivate: null,
    Profession: null,
    SocialSecurityNumber: null,
    StayPermit: null,
    StayPermitExpiry: null,
    Zip: null,
    Href: ''
  };
}
