import * as t from 'io-ts';
import { DateFromISOString } from 'io-ts-types/lib/DateFromISOString';
import { Reference, Option } from './common-types';

const LegalRepresentative = t.type({
  Id: t.number,
  RepresentativeRef: Reference,
  StudentRef: Reference,
  DateFrom: Option(DateFromISOString),
  DateTo: Option(DateFromISOString),
  RepresentativeAfterMajority: t.boolean,
  Href: t.string
});
type LegalRepresentative = t.TypeOf<typeof LegalRepresentative>;
export { LegalRepresentative };

export type LegalRepresentativeProps = t.PropsOf<typeof LegalRepresentative>;
