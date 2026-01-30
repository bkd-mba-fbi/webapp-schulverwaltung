import { HttpTestingController } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { AdditionalInformationsRestService } from "./additional-informations-rest.service";

describe("AdditionalInformationsRestService", () => {
  let service: AdditionalInformationsRestService;
  let successCallback: jasmine.Spy;
  let errorCallback: jasmine.Spy;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule(buildTestModuleMetadata({}));
    service = TestBed.inject(AdditionalInformationsRestService);
    successCallback = jasmine.createSpy("successCallback");
    errorCallback = jasmine.createSpy("errorCallback");
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  describe(".uploadPhoto", () => {
    it("emits an error if the file is not a .jpg", () => {
      service
        .uploadPhoto(1, new File([], "test.png"))
        .subscribe({ next: successCallback, error: errorCallback });

      expect(errorCallback).toHaveBeenCalled();
      expect(successCallback).not.toHaveBeenCalled();
    });

    it("emits an error if uploading a .jpg error and metadata request fails", () => {
      service
        .uploadPhoto(1, new File([], "test.jpg"))
        .subscribe({ next: successCallback, error: errorCallback });

      httpTestingController
        .expectOne("https://eventotest.api/AdditionalInformations/files")
        .flush(null, {
          status: 500,
          statusText: "Internal Server Error",
        });

      expect(errorCallback).toHaveBeenCalled();
      expect(successCallback).not.toHaveBeenCalled();
    });

    it("emits an error if uploading a .jpg error and file request fails", () => {
      service
        .uploadPhoto(1, new File([], "test.jpg"))
        .subscribe({ next: successCallback, error: errorCallback });

      httpTestingController
        .expectOne("https://eventotest.api/AdditionalInformations/files")
        .flush(null, {
          status: 201,
          statusText: "Created",
          headers: {
            location: "/restApi/files/b87caa81-1de6-40d2-8bca-e461c8e760ab",
          },
        });
      httpTestingController
        .expectOne(
          "https://eventotest.api/restApi/files/b87caa81-1de6-40d2-8bca-e461c8e760ab",
        )
        .flush(null, { status: 500, statusText: "Internal Server Error" });

      expect(errorCallback).toHaveBeenCalled();
      expect(successCallback).not.toHaveBeenCalled();
    });

    it("uploads the image file if it is a .jpg", () => {
      service
        .uploadPhoto(1, new File([], "test.jpg"))
        .subscribe({ next: successCallback, error: errorCallback });

      httpTestingController
        .expectOne("https://eventotest.api/AdditionalInformations/files")
        .flush(null, {
          status: 201,
          statusText: "Created",
          headers: {
            location: "/restApi/files/b87caa81-1de6-40d2-8bca-e461c8e760ab",
          },
        });
      httpTestingController
        .expectOne(
          "https://eventotest.api/restApi/files/b87caa81-1de6-40d2-8bca-e461c8e760ab",
        )
        .flush(null, { status: 201, statusText: "Created" });

      expect(successCallback).toHaveBeenCalled();
      expect(errorCallback).not.toHaveBeenCalled();
    });
  });
});
