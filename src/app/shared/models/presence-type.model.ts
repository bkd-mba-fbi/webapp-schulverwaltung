import * as t from 'io-ts';
import { Flag, Option } from './common-types';

const PresenceType = t.type({
  Id: t.number,
  TypeId: t.number,
  Active: Flag,
  Description: t.string,
  Designation: Option(t.string),
  IsAbsence: Flag,
  IsComment: Flag,
  IsDispensation: Flag,
  IsIncident: Flag,
  NeedsConfirmation: Flag,
  Sort: t.number,
  Href: t.string
});
type PresenceType = t.TypeOf<typeof PresenceType>;
export { PresenceType };

export type PresenceTypeProps = t.PropsOf<typeof PresenceType>;
