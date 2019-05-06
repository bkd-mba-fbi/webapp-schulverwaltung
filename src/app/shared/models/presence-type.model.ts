import { RestModel } from './rest.model';
import { Flag } from './common-types';

export class PresenceType extends RestModel {
  Id: number;
  TypeId: number;
  Active: Flag;
  Description: string; // "Absenz;2;aktiv"
  Designation: Option<string>;
  IsAbsence: Flag;
  IsComment: Flag;
  IsDispensation: Flag;
  IsIncident: Flag;
  NeedsConfirmation: Flag;
  Sort: number;
  Href: string;
}
