import * as t from "io-ts";
import { LocalDateTimeFromString, Maybe, Option } from "./common-types";

const ClassRegistration = t.type({
  // StatusId: t.number,
  IsActive: t.boolean,
  // Status: t.string,
  // IdStudyClass: t.number,
  NumberStudyClass: t.string,
  // DesignationStudyClass: t.string,
  Id: t.number,
  // PersonId: t.number,
});

const Student = t.type({
  Id: t.number,
  AddressLine1: Option(t.string),
  AddressLine2: Maybe(t.string),
  Birthdate: Option(LocalDateTimeFromString),
  DisplayEmail: Option(t.string),
  FirstName: t.string,
  FullName: t.string,
  Gender: t.union([t.literal("M"), t.literal("F"), t.literal("X")]),
  LastName: t.string,
  Location: Option(t.string),
  PhoneMobile: Option(t.string),
  PhonePrivate: Option(t.string),
  PostalCode: Option(t.string),
  // HRef: t.string
});

const StudentWithClassRegistration = t.intersection([
  Student,
  t.type({
    ClassRegistrations: t.array(ClassRegistration),
  }),
]);

type Student = t.TypeOf<typeof Student>;
type StudentWithClassRegistration = t.TypeOf<
  typeof StudentWithClassRegistration
>;
type ClassRegistration = t.TypeOf<typeof ClassRegistration>;
export { Student, StudentWithClassRegistration, ClassRegistration };
