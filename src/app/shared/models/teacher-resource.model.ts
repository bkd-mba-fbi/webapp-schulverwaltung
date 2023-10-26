import * as t from "io-ts";

const TeacherResource = t.type({
  HRef: t.string,
  Id: t.number,
  TeacherId: t.number,
  FullName: t.string,
  // Acronym: t.string,
  // Status: t.string,
  // StatusId: t.number,
});

type TeacherResource = t.TypeOf<typeof TeacherResource>;
export { TeacherResource };
