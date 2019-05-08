import { RestModel, RestDateTime } from './rest.model';
import { Reference, Flag } from './common-types';

export class LegalRepresentative extends RestModel {
  Id: number;
  RepresentativeRef: Reference;
  StudentRef: Reference;

  @RestDateTime()
  DateFrom: Date;

  @RestDateTime()
  DateTo: Date;

  RepresentativeAfterMajority: Flag;
  Href: string;
}
