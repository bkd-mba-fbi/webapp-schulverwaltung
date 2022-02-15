import * as t from 'io-ts';
import { Option } from './common-types';

const Test = t.type({
  CourseId: t.number,
  Date: t.string,
  Designation: t.string,
  Weight: t.number,
  WeightPercent: t.number,
  IsPointGrading: t.boolean,
  MaxPoints: Option(t.boolean),
  MaxPointsAdjusted: Option(t.boolean),
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
