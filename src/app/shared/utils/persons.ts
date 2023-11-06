import { differenceInYears } from "date-fns";
import { Person } from "../models/person.model";
import { Student } from "../models/student.model";

const ADULT_AGE = 18;

export function isAdult<T extends Student | Person>(person: T): boolean {
  return (
    differenceInYears(new Date(), person.Birthdate || new Date()) >= ADULT_AGE
  );
}
