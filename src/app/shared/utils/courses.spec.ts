import { getCourseFilterParamsForScope } from "./courses";

describe("courses utils", () => {
  describe("getCourseFilterParamsForScope", () => {
    beforeEach(() => {
      jasmine.clock().install();
      jasmine.clock().mockDate(new Date("2000-01-23T12:00:00"));
    });

    afterEach(() => {
      jasmine.clock().uninstall();
    });

    it("returns a filter for dates before today when scope is 'past'", () => {
      expect(getCourseFilterParamsForScope("past")).toEqual({
        "filter.DateTo": "<2000-01-23",
      });
    });

    it("returns a filter for dates after yesterday when scope is 'current'", () => {
      expect(getCourseFilterParamsForScope("current")).toEqual({
        "filter.DateTo": ">2000-01-22",
      });
    });
  });
});
