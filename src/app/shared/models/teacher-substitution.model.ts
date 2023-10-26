import * as t from "io-ts";

const TeacherSubstitution = t.type({
  // HRef: t.string,
  Id: t.number,
  // HolderId: t.number,
  Holder: t.string,
  // SubstituteId: t.number,
  // Substitute: t.string,
  // DateFrom: LocalDateTimeFromString,
  // DateTo: LocalDateTimeFromString,
  // Remarks: Option(t.string),
  // IsRevoked: t.boolean,
});

type TeacherSubstitution = t.TypeOf<typeof TeacherSubstitution>;
export { TeacherSubstitution };
