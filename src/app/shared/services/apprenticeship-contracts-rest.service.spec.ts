import { HttpTestingController } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { ApprenticeshipContractsRestService } from "./apprenticeship-contracts-rest.service";

describe("ApprenticeshipContractsRestService", () => {
  let service: ApprenticeshipContractsRestService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule(buildTestModuleMetadata({}));
    service = TestBed.inject(ApprenticeshipContractsRestService);
    httpTestingController = TestBed.inject(HttpTestingController);

    jasmine.clock().mockDate(new Date(Date.UTC(2000, 0, 23, 12, 0)));
  });

  afterEach(() => {
    httpTestingController.verify();
    jasmine.clock().uninstall();
  });

  describe("getCompaniesForStudents", () => {
    it("requests the companies for the given student ids", () => {
      const companies = [
        {
          Id: 1,
          StudentId: 54425,
          CompanyName: "Swisscom AG",
          CompanyNameAddition: "Fixnet",
        },
        {
          Id: 2,
          StudentId: 56200,
          CompanyName: "SBB AG",
          CompanyNameAddition: "Werkstätten",
        },
      ];

      service.getCompaniesForStudents([54425, 56200]).subscribe((result) => {
        expect(result).toEqual(companies);
      });

      httpTestingController
        .expectOne(
          "https://eventotest.api/ApprenticeshipContracts/?filter.StudentId=;54425;56200&filter.ApprenticeshipDateFrom=%3C2000-01-23T12:00:00.000Z&filter.ApprenticeshipDateTo=%3E2000-01-23T12:00:00.000Z&fields=Id,StudentId,CompanyName,CompanyNameAddition",
        )
        .flush(companies);
    });
  });

  it("returns an empty array if no ids are given", (done) => {
    service.getCompaniesForStudents([]).subscribe((result) => {
      expect(result).toEqual([]);
      done();
    });
  });
});
