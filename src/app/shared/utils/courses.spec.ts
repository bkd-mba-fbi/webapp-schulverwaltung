import { filterEventsForScope } from "./courses";

describe("courses utils", () => {
  describe("filterEventsForScope", () => {
    const today = new Date("2000-01-23T00:00:00");
    const yesterday = new Date("2000-01-22T00:00:00");
    const tomorrow = new Date("2000-01-24T00:00:00");

    const eventNoDate = { DateTo: null };
    const eventYesterday = { DateTo: yesterday };
    const eventToday = { DateTo: today };
    const eventTomorrow = { DateTo: tomorrow };

    beforeEach(() => {
      jasmine.clock().install();
      jasmine.clock().mockDate(new Date("2000-01-23T12:00:00"));
    });

    afterEach(() => {
      jasmine.clock().uninstall();
    });

    describe("scope 'current'", () => {
      it("includes events with no end date", () => {
        expect(filterEventsForScope("current", [eventNoDate])).toEqual([
          eventNoDate,
        ]);
      });

      it("includes events ending today", () => {
        expect(filterEventsForScope("current", [eventToday])).toEqual([
          eventToday,
        ]);
      });

      it("includes events ending in the future", () => {
        expect(filterEventsForScope("current", [eventTomorrow])).toEqual([
          eventTomorrow,
        ]);
      });

      it("excludes events that ended before today", () => {
        expect(filterEventsForScope("current", [eventYesterday])).toEqual([]);
      });
    });

    describe("scope 'past'", () => {
      it("includes events that ended before today", () => {
        expect(filterEventsForScope("past", [eventYesterday])).toEqual([
          eventYesterday,
        ]);
      });

      it("excludes events ending today", () => {
        expect(filterEventsForScope("past", [eventToday])).toEqual([]);
      });

      it("excludes events ending in the future", () => {
        expect(filterEventsForScope("past", [eventTomorrow])).toEqual([]);
      });

      it("excludes events with no end date", () => {
        expect(filterEventsForScope("past", [eventNoDate])).toEqual([]);
      });
    });
  });
});
