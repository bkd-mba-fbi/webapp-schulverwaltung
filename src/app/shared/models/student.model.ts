import * as t from "io-ts";
import { LocalDateTimeFromString, Maybe, Option } from "./common-types";

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

const StudentSummary = t.type({
  Id: t.number,
  DisplayEmail: Option(t.string),
  FirstName: t.string,
  LastName: t.string,
});

type Student = t.TypeOf<typeof Student>;
type StudentSummary = t.TypeOf<typeof StudentSummary>;
export { Student, StudentSummary };
