import * as t from 'io-ts';

const StudyClass = t.type({
  Id: t.number,
  // Designation: t.string
  // DisplayText: t.string,
  Number: t.string
  // HRef: t.string,
});
type StudyClass = t.TypeOf<typeof StudyClass>;
export { StudyClass };
