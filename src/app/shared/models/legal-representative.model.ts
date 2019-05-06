import { RestModel } from './rest.model';
import { Reference, Flag } from './common-types';

export class LegalRepresentative extends RestModel {
  Id: number;
  RepresentativeRef: Reference;
  StudentRef: Reference;
  DateFrom: string; // Date
  DateTo: string; // Date
  RepresentativeAfterMajority: Flag;
  Href: string;
}
