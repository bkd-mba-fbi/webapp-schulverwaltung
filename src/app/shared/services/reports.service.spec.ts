import { HttpTestingController } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { AvailableReports } from "../models/report.model";
import { ReportsService } from "./reports.service";
import { StorageService } from "./storage.service";

describe("ReportsService", () => {
  let service: ReportsService;
  let httpTestingController: HttpTestingController;
  let callback: jasmine.Spy;

  beforeEach(() => {
    TestBed.configureTestingModule(
      buildTestModuleMetadata({
        providers: [
          {
            provide: StorageService,
            useValue: {
              getAccessToken(): Option<string> {
                return "SOMETOKEN";
              },
              getPayload(): Option<object> {
                return { id_person: "42" };
              },
            },
          },
        ],
      }),
    );
    service = TestBed.inject(ReportsService);
    httpTestingController = TestBed.inject(HttpTestingController);
    callback = jasmine.createSpy("callback");
  });

  afterEach(() => httpTestingController.verify());

  describe("getPersonMasterDataReports", () => {
    it("emits report info if available", () => {
      service.getPersonMasterDataReports(42).subscribe(callback);
      expectAvailabilityRequest(
        "https://eventotest.api/CrystalReports/AvailableReports/Person?ids=290026&keys=42",
        [{ Id: 290026, Title: "Stammblatt" }],
      );

      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith([
        {
          type: "crystal",
          id: 290026,
          title: "Stammblatt",
          url: "https://eventotest.api/Files/CrystalReports/Person/290026?ids=42&token=SOMETOKEN",
        },
      ]);
    });

    it("emits empty array if unavailable", () => {
      service.getPersonMasterDataReports(42).subscribe(callback);
      expectAvailabilityRequest(
        "https://eventotest.api/CrystalReports/AvailableReports/Person?ids=290026&keys=42",
        null,
      );

      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith([]);
    });
  });

  describe("getStudentConfirmationReports", () => {
    it("emits report info if available", () => {
      service
        .getStudentConfirmationReports(["123_456", "456_789"])
        .subscribe(callback);
      expectAvailabilityRequest(
        "https://eventotest.api/CrystalReports/AvailableReports/Praesenzinformation?ids=290036&keys=123_456%2C456_789",
        [{ Id: 290036, Title: "Entschuldigungsformular" }],
      );

      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith([
        {
          type: "crystal",
          id: 290036,
          title: "Entschuldigungsformular",
          url: "https://eventotest.api/Files/CrystalReports/Praesenzinformation/290036?ids=123_456%2C456_789&token=SOMETOKEN",
        },
      ]);
    });

    it("emits empty array if unavailable", () => {
      service
        .getStudentConfirmationReports(["123_456", "456_789"])
        .subscribe(callback);
      expectAvailabilityRequest(
        "https://eventotest.api/CrystalReports/AvailableReports/Praesenzinformation?ids=290036&keys=123_456%2C456_789",
        null,
      );

      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith([]);
    });
  });

  describe("getEvaluateAbsencesReports", () => {
    it("emits report infos if available", () => {
      service
        .getEvaluateAbsencesReports(["123_456", "456_789"])
        .subscribe(callback);
      expectAvailabilityRequest(
        "https://eventotest.api/CrystalReports/AvailableReports/Praesenzinformation?ids=290048&keys=123_456%2C456_789",
        [{ Id: 290048, Title: "Auswertung der Absenzen (PDF)" }],
      );
      expectAvailabilityRequest(
        "https://eventotest.api/ExcelReports/AvailableReports/Praesenzinformation?ids=290033&keys=123_456%2C456_789",
        [{ Id: 290033, Title: "Auswertung der Absenzen (Excel)" }],
      );

      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith([
        {
          type: "crystal",
          id: 290048,
          title: "Auswertung der Absenzen (PDF)",
          url: "https://eventotest.api/Files/CrystalReports/Praesenzinformation/290048?ids=123_456%2C456_789&token=SOMETOKEN",
        },
        {
          type: "excel",
          id: 290033,
          title: "Auswertung der Absenzen (Excel)",
          url: "https://eventotest.api/Files/ExcelReports/Praesenzinformation/290033?ids=123_456%2C456_789&token=SOMETOKEN",
        },
      ]);
    });

    it("emits empty array if unavailable", () => {
      service
        .getEvaluateAbsencesReports(["123_456", "456_789"])
        .subscribe(callback);
      expectAvailabilityRequest(
        "https://eventotest.api/CrystalReports/AvailableReports/Praesenzinformation?ids=290048&keys=123_456%2C456_789",
        null,
      );
      expectAvailabilityRequest(
        "https://eventotest.api/ExcelReports/AvailableReports/Praesenzinformation?ids=290033&keys=123_456%2C456_789",
        null,
      );

      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith([]);
    });
  });

  describe("getMyAbsencesReports", () => {
    it("emits report info if available", () => {
      service.getMyAbsencesReports(["123_456", "456_789"]).subscribe(callback);
      expectAvailabilityRequest(
        "https://eventotest.api/CrystalReports/AvailableReports/Praesenzinformation?ids=290048&keys=123_456%2C456_789",
        [{ Id: 290048, Title: "Auswertung der Absenzen" }],
      );

      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith([
        {
          type: "crystal",
          id: 290048,
          title: "Auswertung der Absenzen",
          url: "https://eventotest.api/Files/CrystalReports/Praesenzinformation/290048?ids=123_456%2C456_789&token=SOMETOKEN",
        },
      ]);
    });

    it("emits empty array if unavailable", () => {
      service.getMyAbsencesReports(["123_456", "456_789"]).subscribe(callback);
      expectAvailabilityRequest(
        "https://eventotest.api/CrystalReports/AvailableReports/Praesenzinformation?ids=290048&keys=123_456%2C456_789",
        null,
      );

      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith([]);
    });
  });

  describe("getCourseReports", () => {
    it("emits report info if available", () => {
      service.getCourseReports(42).subscribe(callback);
      expectAvailabilityRequest(
        "https://eventotest.api/CrystalReports/AvailableReports/Anlass?ids=290044&keys=42",
        [{ Id: 290044, Title: "Tests" }],
      );

      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith([
        {
          type: "crystal",
          id: 290044,
          title: "Tests",
          url: "https://eventotest.api/Files/CrystalReports/Anlass/290044?ids=42&token=SOMETOKEN",
        },
      ]);
    });

    it("emits empty array if unavailable", () => {
      service.getCourseReports(42).subscribe(callback);
      expectAvailabilityRequest(
        "https://eventotest.api/CrystalReports/AvailableReports/Anlass?ids=290044&keys=42",
        null,
      );

      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith([]);
    });
  });

  describe("getStudentSubscriptionReports", () => {
    it("returns report info", () => {
      const result = service.getStudentSubscriptionReports([123, 456]);

      expect(result).toEqual([
        {
          type: "crystal",
          id: 290043,
          title: "Report 1",
          url: "https://eventotest.api/Files/CrystalReports/Anmeldung/290043?ids=123%2C456&token=SOMETOKEN",
        },
      ]);
    });
  });

  describe("getTeacherSubscriptionReports", () => {
    it("returns report info", () => {
      const result = service.getTeacherSubscriptionReports([123, 456]);

      expect(result).toEqual([
        {
          type: "crystal",
          id: 290042,
          title: "Report 1",
          url: "https://eventotest.api/Files/CrystalReports/Anmeldung/290042?ids=123%2C456&token=SOMETOKEN",
        },
      ]);
    });
  });

  function expectAvailabilityRequest(
    urlWithParams: string,
    response: AvailableReports,
    debug = false,
  ): void {
    httpTestingController
      .expectOne((req) => {
        if (debug) {
          console.log("Receiving request:", req.urlWithParams);
          console.log("Expecting request:", urlWithParams);
        }
        return req.urlWithParams === urlWithParams;
      })
      .flush(response);
  }
});
