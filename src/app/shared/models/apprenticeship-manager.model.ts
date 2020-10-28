import * as t from 'io-ts';
import { Maybe, Option } from './common-types';

const ApprenticeshipManager = t.type({
  // HRef: t.string,
  Email: t.string,
  Email2: Option(t.string),
  PhoneBusiness: t.string,
  // PhoneMobile: Option(t.string),
  CompanyName: t.string,
  // CompanyNameAddition: Option(t.string),
  Firstname: Option(t.string),
  // MiddleName: Option(t.string),
  Lastname: Option(t.string),
  // FormOfAddress: Option(t.string),
  // Gender: t.union([t.literal('M'), t.literal('F'), t.literal('X')]),
  AddressLine1: t.string,
  AddressLine2: Maybe(t.string),
  PostalCode: t.string,
  Location: t.string,
  // Country: Option(t.string),
  // CountryId: t.string,
  // CorrespondenceAddress: Option(t.string),
  // CorrespondencePersonId: t.number,
  Id: t.number,
});
type ApprenticeshipManager = t.TypeOf<typeof ApprenticeshipManager>;
export { ApprenticeshipManager };
