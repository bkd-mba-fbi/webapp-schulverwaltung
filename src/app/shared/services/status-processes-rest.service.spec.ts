import { HttpTestingController } from "@angular/common/http/testing";
import { TestBed, fakeAsync, tick } from "@angular/core/testing";
import { buildTestModuleMetadata } from "../../../spec-helpers";
import { StatusProcessesRestService } from "./status-processes-rest.service";

describe("StatusProcessesRestService", () => {
  let service: StatusProcessesRestService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule(buildTestModuleMetadata({}));
    service = TestBed.inject(StatusProcessesRestService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  describe("forwardStatus", () => {
    it("updates status for module events", fakeAsync(() => {
      const statusId = 123;
      const eventId = 456;
      const mockNextStatus = {
        DataClassId: "Anlass",
        Id1: 0, // This will be overwritten with eventId
        Id2: null,
        IdStatus: 124,
        Status: "Next Status",
        Direction: "forward",
        StatusDate: "2025-06-17T00:00:00+01:00",
        IsDelete: false,
        CancelStatusIdInternet: null,
        StatusCodes: null,
      };

      let result: boolean = false;
      void service
        .forwardStatus(statusId, eventId)
        .then((res) => (result = res));

      const getRequest = httpTestingController.expectOne((req) => {
        return (
          req.url.endsWith("/StatusProcesses/forward/") &&
          req.params.get("idStatus") === statusId.toString()
        );
      });

      expect(getRequest.request.method).toBe("GET");
      getRequest.flush([mockNextStatus]);

      tick();

      const postRequest = httpTestingController.expectOne((req) => {
        return req.url.endsWith("/StatusProcesses/") && req.method === "POST";
      });

      const body = postRequest.request.body;

      expect(body.DataClassId).toBe("Anlass");
      expect(body.Id1).toBe(eventId);
      expect(body.IdStatus).toBe(mockNextStatus.IdStatus);
      expect(body.Status).toBe(mockNextStatus.Status);
      expect(body.Direction).toBe(mockNextStatus.Direction);
      postRequest.flush({});

      tick();

      expect(result).toBe(true);
    }));
  });
});
