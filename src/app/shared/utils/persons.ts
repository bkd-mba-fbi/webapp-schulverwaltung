import { differenceInYears } from 'date-fns';
import { Student } from '../models/student.model';
import { Person } from '../models/person.model';

const ADULT_AGE = 18;

export function isAdult<T extends Student | Person>(person: T): boolean {
  return (
    differenceInYears(new Date(), person.Birthdate || new Date()) >= ADULT_AGE
  );
}

export function getLanguagePrefix(person: Person): string {
  const prefix = person.FormOfAddress.split(':');
  return prefix.length > 1 ? prefix[0] : '';
}
