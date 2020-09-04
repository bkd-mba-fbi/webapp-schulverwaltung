import * as t from 'io-ts';
import { Option, Maybe, LocalDateTimeFromString } from './common-types';

const Person = t.type({
  Id: t.number,
  // Country: Option(t.string),
  // CountryId: t.string,
  // FormOfAddress: t.string,
  // FormOfAddressId: Option(t.number),
  // HomeCountry: Option(t.string),
  // HomeCountryId: Option(t.string),
  Nationality: Option(t.string),
  // NationalityId: Option(t.number),
  AddressLine1: Option(t.string),
  AddressLine2: Option(t.string),
  // BillingAddress: Option(t.string),
  Birthdate: Option(LocalDateTimeFromString),
  // CorrespondenceAddress: Option(t.string),
  DisplayEmail: Option(t.string),
  Email: Maybe(t.string),
  Email2: Maybe(t.string),
  FirstName: Option(t.string),
  Gender: Option(t.union([t.literal('M'), t.literal('F'), t.literal('X')])),
  HomeTown: Option(t.string),
  // IsEditable: t.boolean,
  // IsEmployee: t.boolean,
  LastName: Option(t.string),
  Location: Option(t.string),
  // MatriculationNumber: Option(t.string),
  MiddleName: Option(t.string),
  NativeLanguage: Option(t.string),
  PhoneMobile: Option(t.string),
  PhonePrivate: Option(t.string),
  PhoneBusiness: Maybe(t.string),
  // Profession: Option(t.string),
  SocialSecurityNumber: Option(t.string),
  StayPermit: Option(t.string),
  StayPermitExpiry: Option(LocalDateTimeFromString),
  Zip: Option(t.string),
  // HRef: t.string
});

type Person = t.TypeOf<typeof Person>;
export { Person };
