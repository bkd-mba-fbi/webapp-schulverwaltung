import * as t from 'io-ts';
import { DateFromISOString } from 'io-ts-types/lib/Date/DateFromISOString';
import { Reference, Flag, Option } from './common-types';

const LegalRepresentative = t.type({
  Id: t.number,
  RepresentativeRef: Reference,
  StudentRef: Reference,
  DateFrom: Option(DateFromISOString),
  DateTo: Option(DateFromISOString),
  RepresentativeAfterMajority: Flag,
  Href: t.string
});
type LegalRepresentative = t.TypeOf<typeof LegalRepresentative>;
export { LegalRepresentative };

export type LegalRepresentativeProps = t.PropsOf<typeof LegalRepresentative>;
