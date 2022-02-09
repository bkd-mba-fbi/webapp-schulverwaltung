import * as t from 'io-ts';

const StudyClass = t.type({
  Id: t.number,
  Designation: t.string,
  StudentCount: t.number,
  Number: t.string,
  // HRef: t.string,
  // IsActive: t.boolean,
});
type StudyClass = t.TypeOf<typeof StudyClass>;
export { StudyClass };
