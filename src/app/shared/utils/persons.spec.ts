import { isAdult } from './persons';
import { buildPerson, buildStudent } from 'src/spec-builders';
import { Person } from '../models/person.model';
import { Student } from '../models/student.model';

describe('persons utilities', () => {
  beforeEach(() => {
    jasmine.clock().mockDate(new Date(2020, 0, 1));
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  describe('isAdult', () => {
    it('returns true if person or student is 18 years old or older', () => {
      expect(isAdult(buildPersonWithAge(new Date(2002, 0, 1)))).toBe(true);
      expect(isAdult(buildStudentWithAge(new Date(2002, 0, 1)))).toBe(true);
      expect(isAdult(buildPersonWithAge(new Date(2001, 11, 31)))).toBe(true);
      expect(isAdult(buildPersonWithAge(new Date(1980, 0, 1)))).toBe(true);
    });

    it('returns false if person or student is not yet 18 years old', () => {
      expect(isAdult(buildPersonWithAge(new Date(2002, 0, 2)))).toBe(false);
      expect(isAdult(buildStudentWithAge(new Date(2002, 0, 2)))).toBe(false);
      expect(isAdult(buildPersonWithAge(new Date(2010, 0, 1)))).toBe(false);
    });

    it('returns null if person has no birthday defined', () => {
      expect(isAdult(buildPersonWithAge(null))).toBe(false);
    });
  });

  function buildPersonWithAge(birthday: Option<Date>): Person {
    const person = buildPerson(123);
    person.Birthdate = birthday;
    return person;
  }

  function buildStudentWithAge(birthday: Date): Student {
    const student = buildStudent(123);
    student.Birthdate = birthday;
    return student;
  }

  function buildPersonWithFormOfAddress(formOfAddress: string): Person {
    const person = buildPerson(123);
    person.FormOfAddress = formOfAddress;
    return person;
  }
});
