import { canSetFinalGrade, getEventState, isRated } from './events';
import { buildCourse, buildFinalGrading } from '../../../spec-builders';
import { EventState } from '../services/events-state.service';
import { EvaluationStatusRef } from 'src/app/shared/models/course.model';

describe('Course utils', () => {
  describe('Get course state', () => {
    beforeEach(() => {
      jasmine.clock().install();
      jasmine.clock().mockDate(new Date(2022, 1, 3));
    });

    afterEach(() => {
      jasmine.clock().uninstall();
    });

    it('should get no state', () => {
      // given
      const evaluationStatusRef = {
        HasEvaluationStarted: false,
        EvaluationUntil: null,
        HasReviewOfEvaluationStarted: false,
        HasTestGrading: false,
        Id: 6980,
      };

      const course = buildCourse(
        1234,
        'Course in no state',
        undefined,
        evaluationStatusRef
      );

      // then
      expect(getEventState(course)).toEqual(null);
    });

    it('should get state add-tests', () => {
      // given
      const evaluationStatusRef = {
        HasEvaluationStarted: false,
        EvaluationUntil: null,
        HasReviewOfEvaluationStarted: false,
        HasTestGrading: true,
        Id: 6980,
      };

      const course = buildCourse(
        1234,
        'Course in state add-tests',
        undefined,
        evaluationStatusRef
      );

      // then
      expect(getEventState(course)).toEqual({
        value: EventState.Tests,
      });
    });

    it('should get state rating-until', () => {
      // given
      const evaluationStatusRef = {
        HasEvaluationStarted: true,
        EvaluationUntil: new Date(2022, 2, 3),
        HasTestGrading: false,
        Id: 6980,
      };

      const course = buildCourse(
        1234,
        'Course in state rating-until',
        undefined,
        evaluationStatusRef
      );

      // then
      expect(getEventState(course)).toEqual({
        value: EventState.RatingUntil,
      });
    });

    it('should get state intermediate-rating', () => {
      // given
      const evaluationStatusRef = {
        HasEvaluationStarted: true,
        EvaluationUntil: null,
        HasTestGrading: false,
        Id: 6980,
      };

      const course = buildCourse(
        1234,
        'Course in state intermediate-rating',
        undefined,
        evaluationStatusRef,
        undefined,
        10300
      );

      // then
      expect(getEventState(course)).toEqual({
        value: EventState.IntermediateRating,
      });
    });
  });

  describe('Course has final grading enabled', () => {
    it('should return false when HasEvaluationStarted is false and EvaluationUntil is null', () => {
      // given
      const evaluationStatusRef = {
        HasEvaluationStarted: false,
        EvaluationUntil: null,
        HasReviewOfEvaluationStarted: false,
        HasTestGrading: false,
        Id: 6980,
      };

      const course = buildCourse(
        1234,
        'Course in no state',
        undefined,
        evaluationStatusRef
      );

      // then
      expect(canSetFinalGrade(course)).toEqual(false);
    });

    it('should return false when HasEvaluationStarted is false and EvaluationUntil is undefined', () => {
      // given
      const evaluationStatusRef = {
        HasEvaluationStarted: false,
        EvaluationUntil: undefined,
        HasReviewOfEvaluationStarted: false,
        HasTestGrading: false,
        Id: 6980,
      };

      const course = buildCourse(
        1234,
        'Course in no state',
        undefined,
        evaluationStatusRef
      );

      // then
      expect(canSetFinalGrade(course)).toEqual(false);
    });

    it('should return true when evaluation has started and EvaluationUntil is undefined', () => {
      // given
      const evaluationStatusRef = {
        HasEvaluationStarted: true,
        EvaluationUntil: undefined,
        HasReviewOfEvaluationStarted: false,
        HasTestGrading: false,
        Id: 6980,
      };

      const course = buildCourse(
        1234,
        'Course in no state',
        undefined,
        evaluationStatusRef
      );

      // then
      expect(canSetFinalGrade(course)).toEqual(true);
    });

    it('should return true when evaluation has started and EvaluationUntil is null', () => {
      // given
      const evaluationStatusRef = {
        HasEvaluationStarted: true,
        EvaluationUntil: null,
        HasReviewOfEvaluationStarted: false,
        HasTestGrading: false,
        Id: 6980,
      };

      const course = buildCourse(
        1234,
        'Course in no state',
        undefined,
        evaluationStatusRef
      );

      // then
      expect(canSetFinalGrade(course)).toEqual(true);
    });

    it('should return false when evaluation has started and EvaluationUntil is in the past', () => {
      // given
      jasmine.clock().install();
      jasmine.clock().mockDate(new Date(2022, 1, 8));

      const pastDate = new Date(2022, 1, 1);

      const evaluationStatusRef = {
        HasEvaluationStarted: true,
        EvaluationUntil: new Date(pastDate),
        HasReviewOfEvaluationStarted: false,
        HasTestGrading: false,
        Id: 6980,
      };

      const course = buildCourse(
        1234,
        'Course in no state',
        undefined,
        evaluationStatusRef
      );

      // then
      expect(canSetFinalGrade(course)).toEqual(false);
      jasmine.clock().uninstall();
    });

    it('should return true when evaluation has started and EvaluationUntil is in the future', () => {
      // given
      jasmine.clock().install();
      jasmine.clock().mockDate(new Date(2022, 1, 1));
      const futureDate = new Date(2022, 6, 1);

      const evaluationStatusRef = {
        HasEvaluationStarted: true,
        EvaluationUntil: futureDate,
        HasReviewOfEvaluationStarted: false,
        HasTestGrading: false,
        Id: 6980,
      };

      const course = buildCourse(
        1234,
        'Course in no state',
        undefined,
        evaluationStatusRef
      );

      // then
      expect(canSetFinalGrade(course)).toEqual(true);

      jasmine.clock().uninstall();
    });
  });

  describe('is course rated', () => {
    it('should return true if review of evaluation has started and final grades are set', () => {
      // given
      const evaluationStatusRef = {
        HasReviewOfEvaluationStarted: true,
      } as unknown as EvaluationStatusRef;
      let course = buildCourse(
        1,
        'rated course',
        undefined,
        evaluationStatusRef
      );
      course.FinalGrades = [buildFinalGrading(3)];

      // then
      expect(isRated(course)).toBeTrue();
    });

    it('should return false if final grades are null', () => {
      // given
      const evaluationStatusRef = {
        HasReviewOfEvaluationStarted: true,
      } as unknown as EvaluationStatusRef;
      let course = buildCourse(
        1,
        'rated course',
        undefined,
        evaluationStatusRef
      );
      course.FinalGrades = null;

      // then
      expect(isRated(course)).toBeFalse();
    });

    it('should return false if final grades are emtpy', () => {
      // given
      const evaluationStatusRef = {
        HasReviewOfEvaluationStarted: true,
      } as unknown as EvaluationStatusRef;
      let course = buildCourse(
        1,
        'rated course',
        undefined,
        evaluationStatusRef
      );
      course.FinalGrades = [];

      // then
      expect(isRated(course)).toBeFalse();
    });

    it('should return false if review of evaluation has not started', () => {
      // given
      const evaluationStatusRef = {
        HasReviewOfEvaluationStarted: false,
      } as unknown as EvaluationStatusRef;
      let course = buildCourse(
        1,
        'rated course',
        undefined,
        evaluationStatusRef
      );
      course.FinalGrades = null;

      // then
      expect(isRated(course)).toBeFalse();
    });
  });
});
