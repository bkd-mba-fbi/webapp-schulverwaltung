import * as t from 'io-ts';
import { Maybe, Option } from './common-types';

const JobTrainer = t.type({
  // HRef: t.string,
  Email: Option(t.string),
  Email2: Option(t.string),
  PhoneBusiness: Option(t.string),
  PhoneMobile: Option(t.string),
  Firstname: Option(t.string),
  // MiddleName: Option(t.string),
  Lastname: Option(t.string),
  // FormOfAddress: Option(t.string),
  // Gender: t.union([t.literal('M'), t.literal('F'), t.literal('X')]),
  // AddressLine1: Maybe(t.string),
  // AddressLine2: Maybe(t.string),
  // PostalCode: Option(t.string),
  // Location: Option(t.string),
  // Country: Option(t.string),
  // CountryId: t.string,
  // CorrespondenceAddress: Option(t.string),
  // CorrespondencePersonId: t.number,
  Id: t.number,
});
type JobTrainer = t.TypeOf<typeof JobTrainer>;
export { JobTrainer };
