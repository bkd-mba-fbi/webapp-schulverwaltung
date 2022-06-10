import { Result, Test } from 'src/app/shared/models/test.model';
import { buildResult, buildTest } from 'src/spec-builders';
import {
  averageGrade,
  averagePoints,
  maxPoints,
  removeTestById,
  replaceResult,
  resultOfStudent,
  sortByDate,
  toggleIsPublished,
} from './tests';

describe('Test utils', () => {
  describe('update test results', () => {
    it('replace a result in a given test', () => {
      // given
      const result = buildResult(1, 1, 55555);

      const test = buildTest(1, 1, [
        result,
        buildResult(2, 1, 55555),
        buildResult(1, 1, 12345),
      ]);

      const newResult = buildResult(1, 1, 55555);
      newResult.Points = 5;

      // when
      const newTests: Test[] = replaceResult(newResult, [test]);

      // then
      expect(newTests.length).toBe(1);
      const newResults: Result[] = newTests[0].Results!;
      expect(newResults.length).toEqual(3);
      expect(newResults).toContain(newResult);
      expect(newResult).not.toContain(result);
    });

    it('add result to test that has no results yet', () => {
      // given
      const test = buildTest(1, 1, null);
      const newResult = buildResult(1, 2, 12345);

      // when
      const newTests = replaceResult(newResult, [test]);

      // then1
      expect(newTests.length).toBe(1);
      const newResults: Result[] = newTests[0].Results!;
      expect(newResults.length).toBe(1);
      expect(newResults).toContain(newResult);
    });

    it('add new result to test that already has results', () => {
      // given
      const test = buildTest(1, 1, [buildResult(1, 1)]);
      const newResult = buildResult(1, 2, 12345);

      // when
      const newTests = replaceResult(newResult, [test]);

      // then1
      expect(newTests.length).toBe(1);
      const newResults: Result[] = newTests[0].Results!;
      expect(newResults.length).toBe(2);
      expect(newResults).toContain(newResult);
    });
  });

  describe('toggle test states', () => {
    it('should publish test', () => {
      // given
      const testId = 99;
      const test1 = buildTest(1, testId, []);
      test1.IsPublished = false;
      const test2 = buildTest(1, 2, []);

      // when
      const result = toggleIsPublished(testId, [test1, test2]);

      // then
      expect(result.length).toBe(2);
      const publishedTest = result[0];
      expect(publishedTest.Id).toBe(testId);
      expect(publishedTest.IsPublished).toBeTrue();
      expect(result).not.toContain(test1);
      expect(result).toContain(test2);
    });

    it('should unpublish test', () => {
      // given
      const testId = 99;
      const test1 = buildTest(1, testId, []);
      test1.IsPublished = true;
      const test2 = buildTest(1, 2, []);

      // when
      const result = toggleIsPublished(testId, [test1, test2]);

      // then
      expect(result.length).toBe(2);
      const publishedTest = result[0];
      expect(publishedTest.Id).toBe(testId);
      expect(publishedTest.IsPublished).toBeFalse();
      expect(result).not.toContain(test1);
      expect(result).toContain(test2);
    });
  });

  describe('should calculate averages from test', () => {
    it('should calculate points average', () => {
      expect(() => averagePoints(buildTest(1, 1, []))).toThrow(
        new Error('unable to calculate averages without results')
      );
      expect(averagePoints(test)).toBe(11.263636363636364);
    });

    it('should calculate grade averages', () => {
      expect(() => averageGrade(buildTest(1, 1, []))).toThrow(
        new Error('unable to calculate averages without results')
      );
      expect(averageGrade(test)).toBe(3.8272727272727276);
    });
  });

  describe('should get max points from test', () => {
    it('should return max points adjusted', () => {
      test.MaxPoints = 2;
      test.MaxPointsAdjusted = 3;
      expect(maxPoints(test)).toBe(3);
    });

    it('should return max points', () => {
      test.MaxPoints = 2;
      test.MaxPointsAdjusted = null;
      expect(maxPoints(test)).toBe(2);
    });
  });

  describe('get result for student', () => {
    it('should not get result for student that is not in test', () => {
      expect(resultOfStudent(-1, test)).toBeUndefined();
    });

    it('should get result of student', () => {
      expect(resultOfStudent(3777, test)?.Points).toBe(19.99);
    });
  });

  describe('remove tests by id', () => {
    it('should do nothing if tests are empty', () => {
      expect(removeTestById(1, [])).toEqual([]);
    });

    it('should return null if tests are null', () => {
      expect(removeTestById(1, null)).toEqual(null);
    });

    it('should remove test by id', () => {
      const otherTest = buildTest(1, 1, []);
      const result = removeTestById(33, [test, otherTest]);

      expect(result?.length).toBe(1);
      expect(result).toContain(otherTest);
    });
  });

  describe('sort tests by date descending', () => {
    it('should not fail on empty array', () => {
      expect(sortByDate([])).toEqual([]);
    });

    it('should sort tests by date descending', () => {
      const t1 = buildTest(1, 1, []);
      const t2 = buildTest(1, 2, []);
      const t3 = buildTest(1, 3, []);

      t1.Date = new Date('2022-04-02T08:00:00');
      t2.Date = new Date('2022-04-03T08:00:00');
      t3.Date = new Date('2022-04-04T08:00:00');

      expect(sortByDate([t1, t2, t3])[0]).toBe(t3);
    });
  });
});

// test taken from development/ test environment to match a real world test - 2022-04-26
const test: Test = {
  CourseId: 9248,
  Date: new Date('2022-04-02T08:00:00'),
  Designation: 'mbu test 2',
  Weight: 1,
  WeightPercent: 11.76,
  IsPointGrading: true,
  MaxPoints: 20,
  MaxPointsAdjusted: null,
  IsPublished: false,
  IsOwner: true,
  Owner: 'Stolz Zuzana',
  Creation: '2022-04-26T10:11:53.427',
  GradingScaleId: 1106,
  GradingScale: 'Zehntelnoten bes. disp. keine Note',
  Results: [
    {
      TestId: 33,
      CourseRegistrationId: 126885,
      GradeId: 2377,
      GradeValue: null,
      GradeDesignation: 'besucht',
      Points: null,
      StudentId: 4592,
      Id: '33_126885',
    },
    {
      TestId: 33,
      CourseRegistrationId: 126911,
      GradeId: 2379,
      GradeValue: null,
      GradeDesignation: 'keine Note',
      Points: null,
      StudentId: 6282,
      Id: '33_126911',
    },
    {
      TestId: 33,
      CourseRegistrationId: 127866,
      GradeId: 2378,
      GradeValue: null,
      GradeDesignation: 'dispensiert',
      Points: null,
      StudentId: 4600,
      Id: '33_127866',
    },
    {
      TestId: 33,
      CourseRegistrationId: 128592,
      GradeId: 2377,
      GradeValue: null,
      GradeDesignation: 'besucht',
      Points: null,
      StudentId: 4487,
      Id: '33_128592',
    },
    {
      TestId: 33,
      CourseRegistrationId: 129221,
      GradeId: 2378,
      GradeValue: null,
      GradeDesignation: 'dispensiert',
      Points: null,
      StudentId: 4508,
      Id: '33_129221',
    },
    {
      TestId: 33,
      CourseRegistrationId: 129350,
      GradeId: 2379,
      GradeValue: null,
      GradeDesignation: 'keine Note',
      Points: null,
      StudentId: 4515,
      Id: '33_129350',
    },
    {
      TestId: 33,
      CourseRegistrationId: 131336,
      GradeId: 2326,
      GradeValue: null,
      GradeDesignation: '6',
      Points: 19.99,
      StudentId: 3777,
      Id: '33_131336',
    },
    {
      TestId: 33,
      CourseRegistrationId: 131878,
      GradeId: 2346,
      GradeValue: null,
      GradeDesignation: '4',
      Points: 12.01,
      StudentId: 5758,
      Id: '33_131878',
    },
    {
      TestId: 33,
      CourseRegistrationId: 132034,
      GradeId: 2373,
      GradeValue: null,
      GradeDesignation: '1.3',
      Points: 1,
      StudentId: 4566,
      Id: '33_132034',
    },
    {
      TestId: 33,
      CourseRegistrationId: 135207,
      GradeId: 2373,
      GradeValue: null,
      GradeDesignation: '1.3',
      Points: 1.2,
      StudentId: 6871,
      Id: '33_135207',
    },
    {
      TestId: 33,
      CourseRegistrationId: 135210,
      GradeId: 2376,
      GradeValue: null,
      GradeDesignation: '1',
      Points: 0,
      StudentId: 6872,
      Id: '33_135210',
    },
    {
      TestId: 33,
      CourseRegistrationId: 129442,
      GradeId: 2351,
      GradeValue: null,
      GradeDesignation: '3.5',
      Points: 10,
      StudentId: 4519,
      Id: '33_129442',
    },
    {
      TestId: 33,
      CourseRegistrationId: 130308,
      GradeId: 2326,
      GradeValue: null,
      GradeDesignation: '6',
      Points: 20,
      StudentId: 4535,
      Id: '33_130308',
    },
    {
      TestId: 33,
      CourseRegistrationId: 130574,
      GradeId: 2338,
      GradeValue: null,
      GradeDesignation: '4.8',
      Points: 15,
      StudentId: 4543,
      Id: '33_130574',
    },
    {
      TestId: 33,
      CourseRegistrationId: 130762,
      GradeId: 2347,
      GradeValue: null,
      GradeDesignation: '3.9',
      Points: 11.5,
      StudentId: 4553,
      Id: '33_130762',
    },
    {
      TestId: 33,
      CourseRegistrationId: 130951,
      GradeId: 2343,
      GradeValue: null,
      GradeDesignation: '4.3',
      Points: 13.2,
      StudentId: 4557,
      Id: '33_130951',
    },
    {
      TestId: 33,
      CourseRegistrationId: 131199,
      GradeId: 2326,
      GradeValue: null,
      GradeDesignation: '6',
      Points: 20,
      StudentId: 4276,
      Id: '33_131199',
    },
  ],
  Id: 33,
};
