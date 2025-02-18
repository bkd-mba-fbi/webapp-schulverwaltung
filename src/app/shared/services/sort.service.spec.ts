import { TestBed } from "@angular/core/testing";
import { SortCriteria } from "../components/sortable-header/sortable-header.component";
import { SortService } from "./sort.service";

describe("SortService", () => {
  type SortKey = "one" | "two";
  let service: SortService<SortKey>;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject<SortService<SortKey>>(SortService);
  });

  it("emits sort criteria when new value is set", (done) => {
    // given
    const newSortCriteria: SortCriteria<SortKey> = {
      primarySortKey: "one",
      ascending: true,
    };

    // when
    service.sortCriteria.set(newSortCriteria);

    // then
    service.sortCriteria$.subscribe((sortCriteria) => {
      expect(sortCriteria).toEqual(newSortCriteria);
      done();
    });
  });
});
