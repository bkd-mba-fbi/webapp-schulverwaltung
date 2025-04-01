import { HttpTestingController } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { buildGradingItem } from "src/spec-builders";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { GradingItem } from "../models/grading-item.model";
import { GradingItemsRestService } from "./grading-items-rest.service";

describe("GradingItemsRestService", () => {
  let service: GradingItemsRestService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule(buildTestModuleMetadata({}));
    service = TestBed.inject(GradingItemsRestService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  describe("getListForEvent", () => {
    it("fetches grading items for a single event", () => {
      const data: ReadonlyArray<GradingItem> = [
        buildGradingItem(10001),
        buildGradingItem(10002),
      ];

      service
        .getListForEvent(1234)
        .subscribe((result) => expect(result).toEqual(data));

      httpTestingController
        .expectOne(
          ({ urlWithParams }) =>
            urlWithParams ===
            "https://eventotest.api/GradingItems/?idEvent=1234",
        )
        .flush(data);
    });
  });
});
