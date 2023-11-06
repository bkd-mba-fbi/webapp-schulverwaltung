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

  it("should request a grading scale by id", () => {
    const data = buildGradingScale(1234);

    service
      .getGradingScale(1234)
      .subscribe((result) => expect(result).toEqual(data));

    httpTestingController
      .expectOne(
        ({ url }) => url === "https://eventotest.api/GradingScales/1234",
      )
      .flush(data);
  });
});
