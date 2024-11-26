import { EvaluationStatusRef } from "src/app/shared/models/course.model";
import { Event } from "src/app/shared/models/event.model";
import { TokenPayload } from "src/app/shared/models/token-payload.model";
import {
  buildCourse,
  buildEvent,
  buildFinalGrading,
} from "../../../spec-builders";
import { EventState } from "../services/events-state.service";
import {
  canSetFinalGrade,
  getEventState,
  isRated,
  isStudyCourseLeader,
} from "./events";

describe("Event/course utility functions", () => {
  describe("getEventState", () => {
    beforeEach(() => {
      jasmine.clock().install();
      jasmine.clock().mockDate(new Date(2022, 1, 3));
    });

    afterEach(() => {
      jasmine.clock().uninstall();
    });

    it("returns null for course without state", () => {
      const evaluationStatusRef = {
        HasEvaluationStarted: false,
        EvaluationUntil: null,
        HasReviewOfEvaluationStarted: false,
        HasTestGrading: false,
        Id: 6980,
      };

      const course = buildCourse(
        1234,
        "Course in no state",
        undefined,
        evaluationStatusRef,
      );

      expect(getEventState(course)).toEqual(null);
    });

    it("returns 'add-tests' for course in this state", () => {
      const evaluationStatusRef = {
        HasEvaluationStarted: false,
        EvaluationUntil: null,
        HasReviewOfEvaluationStarted: false,
        HasTestGrading: true,
        Id: 6980,
      };

      const course = buildCourse(
        1234,
        "Course in state add-tests",
        undefined,
        evaluationStatusRef,
      );

      expect(getEventState(course)).toEqual({
        value: EventState.Tests,
      });
    });

    it("returns 'rating-until' for course in this state", () => {
      const evaluationStatusRef = {
        HasEvaluationStarted: true,
        EvaluationUntil: new Date(2022, 2, 3),
        HasTestGrading: false,
        Id: 6980,
      };

      const course = buildCourse(
        1234,
        "Course in state rating-until",
        undefined,
        evaluationStatusRef,
      );

      expect(getEventState(course)).toEqual({
        value: EventState.RatingUntil,
      });
    });

    it("returns 'intermediate-rating' for course in this state", () => {
      const evaluationStatusRef = {
        HasEvaluationStarted: true,
        EvaluationUntil: null,
        HasTestGrading: false,
        Id: 6980,
      };

      const course = buildCourse(
        1234,
        "Course in state intermediate-rating",
        undefined,
        evaluationStatusRef,
        undefined,
        10300,
      );

      expect(getEventState(course)).toEqual({
        value: EventState.IntermediateRating,
      });
    });
  });

  describe("canSetFinalGrade", () => {
    it("returns false when HasEvaluationStarted is false and EvaluationUntil is null", () => {
      const evaluationStatusRef = {
        HasEvaluationStarted: false,
        EvaluationUntil: null,
        HasReviewOfEvaluationStarted: false,
        HasTestGrading: false,
        Id: 6980,
      };

      const course = buildCourse(
        1234,
        "Course in no state",
        undefined,
        evaluationStatusRef,
      );

      expect(canSetFinalGrade(course)).toEqual(false);
    });

    it("returns false when HasEvaluationStarted is false and EvaluationUntil is undefined", () => {
      const evaluationStatusRef = {
        HasEvaluationStarted: false,
        EvaluationUntil: undefined,
        HasReviewOfEvaluationStarted: false,
        HasTestGrading: false,
        Id: 6980,
      };

      const course = buildCourse(
        1234,
        "Course in no state",
        undefined,
        evaluationStatusRef,
      );

      expect(canSetFinalGrade(course)).toEqual(false);
    });

    it("returns true when evaluation has started and EvaluationUntil is undefined", () => {
      const evaluationStatusRef = {
        HasEvaluationStarted: true,
        EvaluationUntil: undefined,
        HasReviewOfEvaluationStarted: false,
        HasTestGrading: false,
        Id: 6980,
      };

      const course = buildCourse(
        1234,
        "Course in no state",
        undefined,
        evaluationStatusRef,
      );

      expect(canSetFinalGrade(course)).toEqual(true);
    });

    it("returns true when evaluation has started and EvaluationUntil is null", () => {
      const evaluationStatusRef = {
        HasEvaluationStarted: true,
        EvaluationUntil: null,
        HasReviewOfEvaluationStarted: false,
        HasTestGrading: false,
        Id: 6980,
      };

      const course = buildCourse(
        1234,
        "Course in no state",
        undefined,
        evaluationStatusRef,
      );

      expect(canSetFinalGrade(course)).toEqual(true);
    });

    it("returns false when evaluation has started and EvaluationUntil is in the past", () => {
      jasmine.clock().install();
      jasmine.clock().mockDate(new Date(2022, 1, 8));

      const pastDate = new Date(2022, 1, 1);

      const evaluationStatusRef = {
        HasEvaluationStarted: false,
        EvaluationUntil: new Date(pastDate),
        HasReviewOfEvaluationStarted: false,
        HasTestGrading: false,
        Id: 6980,
      };

      const course = buildCourse(
        1234,
        "Course in no state",
        undefined,
        evaluationStatusRef,
      );

      expect(canSetFinalGrade(course)).toEqual(false);
      jasmine.clock().uninstall();
    });

    it("returns true when evaluation has started and EvaluationUntil is in the future", () => {
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
        "Course in no state",
        undefined,
        evaluationStatusRef,
      );

      expect(canSetFinalGrade(course)).toEqual(true);

      jasmine.clock().uninstall();
    });
  });

  describe("isRated", () => {
    it("returns true if review of evaluation has started and final grades are set", () => {
      const evaluationStatusRef = {
        HasReviewOfEvaluationStarted: true,
      } as unknown as EvaluationStatusRef;
      const course = buildCourse(
        1,
        "rated course",
        undefined,
        evaluationStatusRef,
      );
      course.FinalGrades = [buildFinalGrading(3)];

      expect(isRated(course)).toBeTrue();
    });

    it("returns false if final grades are null", () => {
      const evaluationStatusRef = {
        HasReviewOfEvaluationStarted: true,
      } as unknown as EvaluationStatusRef;
      const course = buildCourse(
        1,
        "rated course",
        undefined,
        evaluationStatusRef,
      );
      course.FinalGrades = null;

      expect(isRated(course)).toBeFalse();
    });

    it("returns false if final grades are emtpy", () => {
      const evaluationStatusRef = {
        HasReviewOfEvaluationStarted: true,
      } as unknown as EvaluationStatusRef;
      const course = buildCourse(
        1,
        "rated course",
        undefined,
        evaluationStatusRef,
      );
      course.FinalGrades = [];

      expect(isRated(course)).toBeFalse();
    });

    it("returns false if review of evaluation has not started", () => {
      const evaluationStatusRef = {
        HasReviewOfEvaluationStarted: false,
      } as unknown as EvaluationStatusRef;
      const course = buildCourse(
        1,
        "rated course",
        undefined,
        evaluationStatusRef,
      );
      course.FinalGrades = null;

      expect(isRated(course)).toBeFalse();
    });
  });

  describe("isStudyCourseLeader", () => {
    let event: Event;
    let tokenPayload: TokenPayload;

    beforeEach(() => {
      event = buildEvent(1234, "Gymnasialer Bildungsgang");
      tokenPayload = {
        culture_info: "de_CH",
        fullname: "Jane Doe",
        id_person: "123",
        holder_id: "456",
        instance_id: "678",
        roles: "",
        substitution_id: undefined,
      };
    });

    describe("study course with single leadership", () => {
      beforeEach(() => {
        event.Leadership = "Jane Doe";
      });

      it("returns false if token payload is unavailable", () => {
        expect(isStudyCourseLeader(null, event)).toBeFalse();
      });

      it("returns true if user is leader", () => {
        expect(isStudyCourseLeader(tokenPayload, event)).toBeTrue();
      });

      it("returns false if user is not leader", () => {
        tokenPayload.fullname = "Jeanne Doe";
        expect(isStudyCourseLeader(tokenPayload, event)).toBeFalse();
      });
    });

    describe("study course with multiple leaderships", () => {
      beforeEach(() => {
        event.Leadership = "John Doe, Jane Doe";
      });

      it("returns true if user is leader", () => {
        expect(isStudyCourseLeader(tokenPayload, event)).toBeTrue();
      });

      it("returns false if user is not leader", () => {
        tokenPayload.fullname = "Jeanne Doe";
        expect(isStudyCourseLeader(tokenPayload, event)).toBeFalse();
      });
    });
  });
});
