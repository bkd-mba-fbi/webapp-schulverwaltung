import { TestBed } from "@angular/core/testing";
import { SortCriteria } from "../utils/sort";
import { SortService } from "./sort.service";

describe("SortService", () => {
  type SortableKeys = "one" | "two";
  let service: SortService<SortableKeys>;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SortService);
  });

  it("should set the sorting", (done) => {
    // given
    const newSorting: SortCriteria<SortableKeys> = {
      primarySortKey: "one",
      ascending: true,
    };

    // when
    service.setSorting(newSorting);

    // then
    service.sorting$.subscribe((sorting) => {
      expect(sorting).toEqual(newSorting);
      done();
    });
  });

  it("should toggle the sorting", (done) => {
    // given
    const sorting: SortCriteria<SortableKeys> = {
      primarySortKey: "one",
      ascending: true,
    };
    service.setSorting(sorting);

    // when
    service.toggleSorting("one");

    // then
    service.sorting$.subscribe((result) => {
      expect(result).toEqual({ primarySortKey: "one", ascending: false });
      done();
    });
  });

  describe("get sorting chars", () => {
    it("should get no char if no sorting is specified", (done) => {
      // given

      // when
      service.getSortingChar$("one").subscribe((char) => {
        // then
        expect(char).toBe("");
        done();
      });
    });

    it("should get no char if different column is sorted", (done) => {
      // given
      const sorting: SortCriteria<SortableKeys> = {
        primarySortKey: "one",
        ascending: true,
      };
      service.setSorting(sorting);

      // when
      service.getSortingChar$("two").subscribe((char) => {
        // then
        expect(char).toBe("");
        done();
      });
    });

    it("should get arrow down if column is sorted ascending", (done) => {
      // given
      const sorting: SortCriteria<SortableKeys> = {
        primarySortKey: "one",
        ascending: true,
      };
      service.setSorting(sorting);

      // when
      service.getSortingChar$("one").subscribe((char) => {
        // then
        expect(char).toBe("↓");
        done();
      });
    });

    it("should get arrow up if column is sorted descending", (done) => {
      // given
      const sorting: SortCriteria<SortableKeys> = {
        primarySortKey: "one",
        ascending: false,
      };
      service.setSorting(sorting);

      // when
      service.getSortingChar$("one").subscribe((char) => {
        // then
        expect(char).toBe("↑");
        done();
      });
    });
  });
});
