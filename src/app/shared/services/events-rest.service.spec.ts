import { HttpTestingController } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { buildTestModuleMetadata } from "../../../spec-helpers";
import { EventsRestService } from "./events-rest.service";

/* eslint-disable @typescript-eslint/no-explicit-any */

describe("EventsRestService", () => {
  let service: EventsRestService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule(buildTestModuleMetadata({}));
    service = TestBed.inject(EventsRestService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  describe(".getStudyCourseEvents", () => {
    it("filters returns the events with EventTypeId=1", () => {
      const data: any[] = [];
      const url = "https://eventotest.api/Events/?filter.EventTypeId==1";

      service
        .getStudyCourseEvents()
        .subscribe((result) => expect(result).toBe(data));

      httpTestingController
        .expectOne((req) => req.urlWithParams === url, url)
        .flush(data);
      httpTestingController.verify();
    });
  });

  describe(".getSubscriptionDetailsDefinitions", () => {
    it("gets the list of subscription details definitions for the given event id", () => {
      const data: any[] = [];
      const url = "https://eventotest.api/Events/1234/SubscriptionDetails";

      service
        .getSubscriptionDetailsDefinitions(1234)
        .subscribe((result) => expect(result).toBe(data));

      httpTestingController
        .expectOne((req) => req.url === url, url)
        .flush(data);
      httpTestingController.verify();
    });
  });
});
