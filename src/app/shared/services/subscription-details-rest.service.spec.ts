import { HttpTestingController } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { buildTestModuleMetadata } from "../../../spec-helpers";
import { isEqual } from "lodash-es";

import { SubscriptionDetailsRestService } from "./subscription-details-rest.service";
import { buildSubscriptionDetail } from "../../../spec-builders";
import { SubscriptionDetail } from "../models/subscription-detail.model";

describe("SubscriptionDetailsRestService", () => {
  let service: SubscriptionDetailsRestService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule(buildTestModuleMetadata({}));
    service = TestBed.inject(SubscriptionDetailsRestService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  describe(".getListForEvent", () => {
    it("fetches the list of subscription details for the given event id", () => {
      const data: ReadonlyArray<SubscriptionDetail> = [
        buildSubscriptionDetail(1),
        buildSubscriptionDetail(2),
      ];

      const expectedUrl =
        "https://eventotest.api/SubscriptionDetails/?IdEvent=1234";

      let result: ReadonlyArray<SubscriptionDetail> = [];
      service
        .getListForEvent(1234)
        .subscribe((response) => (result = response));

      httpTestingController
        .expectOne(
          ({ urlWithParams }) => urlWithParams === expectedUrl,
          expectedUrl,
        )
        .flush(data);

      httpTestingController.verify();
      expect(result).toEqual(data);
    });
  });

  describe(".update", () => {
    it("adds group A to the given subscription", () => {
      const url = "https://eventotest.api/SubscriptionDetails/1";
      const detail = buildSubscriptionDetail(3843, "");
      const body = {
        IdPerson: 1,
        EventId: 1,
        Value: "A",
      };
      service
        .update("A", detail)
        .subscribe((result) => expect(result).toBeUndefined());

      httpTestingController
        .expectOne(
          (req) =>
            req.url === url && req.method === "PUT" && isEqual(req.body, body),
          url,
        )
        .flush(body);
      httpTestingController.verify();
    });

    it("removes the group from the given subscription", () => {
      const url = "https://eventotest.api/SubscriptionDetails/1";
      const detail = buildSubscriptionDetail(3843, "B");
      const body = {
        IdPerson: 1,
        EventId: 1,
        Value: null,
      };
      service
        .update(null, detail)
        .subscribe((result) => expect(result).toBeUndefined());

      httpTestingController
        .expectOne(
          (req) =>
            req.url === url && req.method === "PUT" && isEqual(req.body, body),
          url,
        )
        .flush(body);
      httpTestingController.verify();
    });
  });
});
