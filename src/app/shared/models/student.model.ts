import { RestModel } from './rest.model';

export class Student extends RestModel {
  Id: number;
  AddressLine1: string;
  AdressLine2: string;
  Birthdate: string; // '2002-08-12T00:00:00'
  DisplayEmail: string;
  FirstName: string;
  FullName: string;
  Gender: string; // 'M' || 'F'
  LastName: string;
  Location: string;
  PhoneMobile: string;
  PhonePrivate: string;
  PostalCode: string;
  Href: string;
}
