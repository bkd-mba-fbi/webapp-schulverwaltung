import * as t from "io-ts";
import { LocalDateTimeFromString, Option } from "./common-types";

const Result = t.type({
  Id: t.string,
  TestId: t.number,
  CourseRegistrationId: t.number,
  GradeId: Option(t.number),
  GradeValue: Option(t.number),
  GradeDesignation: Option(t.string),
  Points: Option(t.number),
  StudentId: t.number,
});

type Result = t.TypeOf<typeof Result>;
export { Result };

const Test = t.type({
  Id: t.number,
  CourseId: t.number,
  Date: LocalDateTimeFromString,
  Designation: t.string,
  Weight: t.number,
  WeightPercent: t.number,
  IsPointGrading: t.boolean,
  MaxPoints: Option(t.number),
  MaxPointsAdjusted: Option(t.number),
  IsPublished: t.boolean,
  IsOwner: t.boolean,
  Owner: Option(t.string),
  // Creation: t.string,
  GradingScaleId: Option(t.number),
  // GradingScale: Option(t.string),
  Results: Option(t.array(Result)),
});

type Test = t.TypeOf<typeof Test>;
export { Test };
