import * as t from "io-ts";
import { LocalDateTimeFromString, Maybe, Option } from "./common-types";

const Participant = t.type({
  Id: t.number,
  AddressLine1: Option(t.string),
  AddressLine2: Maybe(t.string),
  Birthdate: Option(LocalDateTimeFromString),
  DisplayEmail: Option(t.string),
  FirstName: t.string,
  FullName: t.string,
  Gender: t.union([t.literal("M"), t.literal("F"), t.literal("X")]),
  IsActive: t.boolean,
  IsWaitingList: t.boolean,
  LastName: t.string,
  Location: Option(t.string),
  PersonId: t.number,
  PhoneMobile: Option(t.string),
  PhonePrivate: Option(t.string),
  PostalCode: Option(t.string),
  RegistrationDate: LocalDateTimeFromString,
  RegistrationId: t.number,
  StatusId: t.number,
  StatusName: t.string,
  StatusNameInternet: t.string,
  // HRef: t.string
});

type Participant = t.TypeOf<typeof Participant>;
export { Participant };
