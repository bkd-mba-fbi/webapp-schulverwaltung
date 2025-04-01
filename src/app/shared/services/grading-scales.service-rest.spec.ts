import { HttpTestingController } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { buildGradingScale } from "src/spec-builders";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { GradingScalesRestService } from "./grading-scales-rest.service";

describe("GradingScalesRestService", () => {
  let service: GradingScalesRestService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule(buildTestModuleMetadata({}));
    service = TestBed.inject(GradingScalesRestService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  describe("getListForIds", () => {
    it("fetches all grading scales of the given ids", () => {
      const scale1 = buildGradingScale(1234);
      const scale2 = buildGradingScale(5678);
      const data = [scale1, scale2];

      service
        .getListForIds([1234, 5678])
        .subscribe((result) => expect(result).toEqual(data));

      httpTestingController
        .expectOne(
          ({ url }) => url === "https://eventotest.api/GradingScales/1234",
        )
        .flush(scale1);

      httpTestingController
        .expectOne(
          ({ url }) => url === "https://eventotest.api/GradingScales/5678",
        )
        .flush(scale2);
    });
  });
});
