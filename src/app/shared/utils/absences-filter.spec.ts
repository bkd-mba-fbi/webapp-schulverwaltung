import { HttpParams } from "@angular/common/http";
import { addAbsencesFilterDateParams } from "./absences-filter";

describe("absences-filter utils", () => {
  describe("addAbsencesFilterDateParams", () => {
    it("returns params unchanged when both dates are null", () => {
      const params = new HttpParams().set("foo", "bar");
      const result = addAbsencesFilterDateParams(
        { dateFrom: null, dateTo: null },
        params,
      );
      expect(result.keys()).toEqual(["foo"]);
      expect(result.get("foo")).toBe("bar");
    });

    it("sets equality filter when dateFrom and dateTo are the same day", () => {
      const date = new Date(2024, 0, 15);
      const result = addAbsencesFilterDateParams(
        { dateFrom: date, dateTo: date },
        new HttpParams(),
      );
      expect(result.keys()).toEqual(["filter.LessonDateTimeFrom"]);
      expect(result.get("filter.LessonDateTimeFrom")).toBe("=2024-01-15");
    });

    it("sets a greater-than filter (one day before) when only dateFrom is set", () => {
      const result = addAbsencesFilterDateParams(
        { dateFrom: new Date(2024, 0, 15), dateTo: null },
        new HttpParams(),
      );
      expect(result.keys()).toEqual(["filter.LessonDateTimeFrom"]);
      expect(result.get("filter.LessonDateTimeFrom")).toBe(">2024-01-14");
    });

    it("sets a less-than filter (one day after) when only dateTo is set", () => {
      const result = addAbsencesFilterDateParams(
        { dateFrom: null, dateTo: new Date(2024, 0, 15) },
        new HttpParams(),
      );
      expect(result.keys()).toEqual(["filter.LessonDateTimeTo"]);
      expect(result.get("filter.LessonDateTimeTo")).toBe("<2024-01-16");
    });

    it("sets both range filters when dateFrom and dateTo differ", () => {
      const result = addAbsencesFilterDateParams(
        {
          dateFrom: new Date(2024, 0, 15),
          dateTo: new Date(2024, 0, 20),
        },
        new HttpParams(),
      );
      expect(result.get("filter.LessonDateTimeFrom")).toBe(">2024-01-14");
      expect(result.get("filter.LessonDateTimeTo")).toBe("<2024-01-21");
    });

    it("preserves existing params", () => {
      const params = new HttpParams().set("foo", "bar");
      const result = addAbsencesFilterDateParams(
        {
          dateFrom: new Date(2024, 0, 15),
          dateTo: new Date(2024, 0, 20),
        },
        params,
      );
      expect(result.get("foo")).toBe("bar");
      expect(result.get("filter.LessonDateTimeFrom")).toBe(">2024-01-14");
      expect(result.get("filter.LessonDateTimeTo")).toBe("<2024-01-21");
    });
  });
});
