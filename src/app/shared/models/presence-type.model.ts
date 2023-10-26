import * as t from "io-ts";
import { Option } from "./common-types";

const PresenceType = t.type({
  Id: t.number,
  // TypeId: t.number,
  Active: t.boolean,
  // Description: Maybe(t.string),
  Designation: Option(t.string),
  IsAbsence: t.boolean,
  IsComment: t.boolean,
  IsDispensation: t.boolean,
  IsIncident: t.boolean,
  IsHalfDay: t.boolean,
  NeedsConfirmation: t.boolean,
  Sort: t.number,
});
type PresenceType = t.TypeOf<typeof PresenceType>;
export { PresenceType };
