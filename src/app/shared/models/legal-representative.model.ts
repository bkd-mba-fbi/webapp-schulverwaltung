import * as t from 'io-ts';
import { DateFromISOString } from 'io-ts-types/lib/Date/DateFromISOString';
import { Reference, Flag } from './common-types';

const LegalRepresentative = t.type({
  Id: t.number,
  RepresentativeRef: Reference,
  StudentRef: Reference,
  DateFrom: DateFromISOString,
  DateTo: DateFromISOString,
  RepresentativeAfterMajority: Flag,
  Href: t.string
});
type LegalRepresentative = t.TypeOf<typeof LegalRepresentative>;
export { LegalRepresentative };

export type LegalRepresentativeProps = t.PropsOf<typeof LegalRepresentative>;
