import * as t from 'io-ts';

const Test = t.type({
  CourseId: t.number,
  Date: t.string,
  Designation: t.string,
  Weight: t.number,
  WeightPercent: t.number,
  IsPointGrading: t.boolean,
  MaxPoints: t.boolean,
  MaxPointsAdjusted: t.boolean,
  IsPublished: t.boolean,
  IsOwner: t.boolean,
  // Owner: null,
  Creation: t.string,
  GradingScaleId: t.number,
  GradingScale: t.string,
  // Results: null
});

type Test = t.TypeOf<typeof Test>;
export { Test };
