import { canSetFinalGrade, getState } from './events';
import { buildCourse } from '../../../spec-builders';
import { EventState } from '../services/events-state.service';

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
      expect(getState(course)).toEqual(null);
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
      expect(getState(course)).toEqual(EventState.Tests);
    });

    it('should get state rating-until', () => {
      // given
      const evaluationStatusRef = {
        HasEvaluationStarted: true,
        EvaluationUntil: new Date(2022, 2, 3),
        HasReviewOfEvaluationStarted: false,
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
      expect(getState(course)).toEqual(EventState.RatingUntil);
    });

    it('should get state intermediate-rating', () => {
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
        'Course in state intermediate-rating',
        undefined,
        evaluationStatusRef
      );

      // then
      expect(getState(course)).toEqual(EventState.IntermediateRating);
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
});