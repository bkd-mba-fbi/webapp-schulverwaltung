import * as t from 'io-ts';
import { DateFromISOString } from 'io-ts-types/lib/Date/DateFromISOString';
import { Option, Maybe } from './common-types';

const Student = t.type({
  Id: t.number,
  AddressLine1: t.string,
  AddressLine2: Maybe(t.string), // TODO
  Birthdate: DateFromISOString,
  DisplayEmail: t.string,
  FirstName: t.string,
  FullName: t.string,
  Gender: t.union([t.literal('M'), t.literal('F')]),
  LastName: t.string,
  Location: t.string,
  PhoneMobile: t.string,
  PhonePrivate: t.string,
  PostalCode: t.string,
  Href: t.string
});
type Student = t.TypeOf<typeof Student>;
export { Student };

export type StudentProps = t.PropsOf<typeof Student>;
