import { HttpTestingController } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { SubscriptionDetailsDisplay } from "../models/configurations.model";
import { ConfigurationsRestService } from "./configurations-rest.service";

describe("ConfigurationsRestService", () => {
  let service: ConfigurationsRestService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule(buildTestModuleMetadata({}));
    service = TestBed.inject(ConfigurationsRestService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpTestingController.verify());

  describe("getSubscriptionDetailsDisplay", () => {
    it("fetches the subscription details display", () => {
      const display: SubscriptionDetailsDisplay = {
        adAsColumns: [1, 2, 3],
        adAsCriteria: [4, 5, 6],
      };

      service
        .getSubscriptionDetailsDisplay()
        .subscribe((result) => expect(result).toEqual(display));

      httpTestingController
        .expectOne(
          (req) =>
            req.urlWithParams ===
            "https://eventotest.api/Configurations/Grading",
        )
        .flush(display);
    });
  });
});
