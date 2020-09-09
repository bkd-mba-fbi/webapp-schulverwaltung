import * as t from 'io-ts';

const LegalRepresentative = t.type({
  Id: t.number,
  // TypeId: t.string,
  RepresentativeId: t.number,
  // StudentId: t.number,
  // DateFrom: Option(LocalDateTimeFromString),
  // DateTo: Option(LocalDateTimeFromString),
  RepresentativeAfterMajority: t.boolean,
});
type LegalRepresentative = t.TypeOf<typeof LegalRepresentative>;
export { LegalRepresentative };
