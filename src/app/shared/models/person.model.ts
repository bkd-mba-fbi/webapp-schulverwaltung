import * as t from 'io-ts';
import { Option, Maybe, Gender } from './common-types';

const Person = t.type({
  Id: t.number,
  // Country: Option(t.string),
  // CountryId: t.string,
  // FormOfAddress: t.string,
  // FormOfAddressId: Option(t.number),
  // HomeCountry: Option(t.string),
  // HomeCountryId: Option(t.string),
  // Nationality: Option(t.string),
  // NationalityId: Option(t.number),
  AddressLine1: Option(t.string),
  AddressLine2: Option(t.string),
  // BillingAddress: Option(t.string),
  // Birthdate: Option(DateFromISOString),
  // CorrespondenceAddress: Option(t.string),
  DisplayEmail: Option(t.string),
  // Email: Option(t.string),
  // Email2: Option(t.string),
  FirstName: t.string,
  Gender, // t.union([t.literal('M'), t.literal('F')]),
  // HomeTown: Option(t.string),
  // IsEditable: t.boolean,
  // IsEmployee: t.boolean,
  LastName: t.string,
  Location: Option(t.string),
  // MatriculationNumber: Option(t.string),
  // MiddleName: Option(t.string),
  // NativeLanguage: Option(t.string),
  PhoneMobile: Option(t.string),
  PhonePrivate: Option(t.string),
  PhoneBusiness: Maybe(t.string),
  // Profession: Option(t.string),
  // SocialSecurityNumber: Option(t.string),
  // StayPermit: Option(t.string),
  // StayPermitExpiry: Option(DateFromISOString),
  Zip: Option(t.string)
  // HRef: t.string
});

type Person = t.TypeOf<typeof Person>;
export { Person };

export type PersonProps = t.PropsOf<typeof Person>;
