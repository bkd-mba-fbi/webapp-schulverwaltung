import * as t from "io-ts";

const EducationalEvent = t.type({
  Id: t.number,
  Designation: t.string,
  Number: t.string,
});
type EducationalEvent = t.TypeOf<typeof EducationalEvent>;
export { EducationalEvent };
