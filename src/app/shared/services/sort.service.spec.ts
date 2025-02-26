import { TestBed } from "@angular/core/testing";
import { SortCriteria } from "../components/sortable-header/sortable-header.component";
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
});
