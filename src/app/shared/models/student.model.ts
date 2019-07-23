import * as t from 'io-ts';
import { DateFromISOString } from 'io-ts-types/lib/DateFromISOString';
import { Maybe, Option, Gender } from './common-types';

const Student = t.type({
  Id: t.number,
  AddressLine1: t.string,
  AddressLine2: Maybe(t.string),
  Birthdate: DateFromISOString,
  DisplayEmail: t.string,
  FirstName: t.string,
  FullName: t.string,
  // Gender: t.union([t.literal('M'), t.literal('F')]),
  Gender,
  LastName: t.string,
  Location: t.string,
  PhoneMobile: Option(t.string),
  PhonePrivate: Option(t.string),
  PostalCode: t.string,
  HRef: t.string
});
type Student = t.TypeOf<typeof Student>;
export { Student };

export type StudentProps = t.PropsOf<typeof Student>;
