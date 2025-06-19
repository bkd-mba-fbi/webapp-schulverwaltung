import * as t from "io-ts";
import { Option } from "./common-types";

const Grade = t.type({
  Id: t.number,
  // IdGradingScale: t.number,
  Designation: t.string,
  Value: t.number,
  Sufficient: t.boolean,
  Sort: Option(t.string),
  // IdObject: t.number,
  // HRef: Option(t.string),
});

const GradingScale = t.type({
  Id: t.number,
  // Designation: t.string,
  // MinGrade: Option(t.number),
  // MaxGrade: Option(t.number),
  CommentsAllowed: t.boolean,
  // LowestSufficientGrade: t.number,
  RisingGrades: t.boolean,
  Grades: t.array(Grade),
  // IdObject: t.number,
  // FreeGrading: t.boolean,
  // HRef: t.string,
});

type GradingScale = t.TypeOf<typeof GradingScale>;
type Grade = t.TypeOf<typeof Grade>;
export { GradingScale, Grade };
