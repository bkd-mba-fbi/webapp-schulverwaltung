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

  describe(".createWithFile", () => {
    it("emits an error if entry creation request fails", () => {
      service
        .createWithFile(
          { Designation: "Anruf Eltern", CodeId: 2000267 },
          new File([], "test.pdf"),
          "test.pdf",
        )
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

    it("emits an error if entry creation was successful but file upload request fails", () => {
      service
        .createWithFile(
          { Designation: "Anruf Eltern", CodeId: 2000267 },
          new File([], "test.pdf"),
          "test.pdf",
        )
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

    it("successfully creates the entry & uploads the image file", () => {
      service
        .createWithFile(
          { Designation: "Anruf Eltern", CodeId: 2000267 },
          new File([], "test.pdf"),
          "test.pdf",
        )
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

  describe(".createAvatar", () => {
    it("emits an error if the file is not a .jpg", () => {
      service
        .createAvatar(1, new File([], "test.png"))
        .subscribe({ next: successCallback, error: errorCallback });

      expect(errorCallback).toHaveBeenCalled();
      expect(successCallback).not.toHaveBeenCalled();
    });

    it("emits an error if entry creation request fails", () => {
      service
        .createAvatar(1, new File([], "test.jpg"))
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

    it("emits an error if entry creation was successful but file upload request fails", () => {
      service
        .createAvatar(1, new File([], "test.jpg"))
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

    it("successfully creates the entry & uploads the image file", () => {
      service
        .createAvatar(1, new File([], "test.jpg"))
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
