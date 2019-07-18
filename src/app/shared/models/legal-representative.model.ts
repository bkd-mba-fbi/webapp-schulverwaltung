import * as t from 'io-ts';
import { DateFromISOString } from 'io-ts-types/lib/DateFromISOString';
import { Option } from './common-types';

const LegalRepresentative = t.type({
  Id: t.number,
  TypeId: t.string,
  RepresentativeId: t.number,
  StudentId: t.number,
  DateFrom: Option(DateFromISOString),
  DateTo: Option(DateFromISOString),
  RepresentativeAfterMajority: t.boolean
});
type LegalRepresentative = t.TypeOf<typeof LegalRepresentative>;
export { LegalRepresentative };

export type LegalRepresentativeProps = t.PropsOf<typeof LegalRepresentative>;
