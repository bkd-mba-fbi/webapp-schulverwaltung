import { HttpTestingController } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { buildIdSubscription } from "src/spec-builders";
import { buildTestModuleMetadata } from "../../../spec-helpers";
import { IdSubscription } from "../models/subscription-detail.model";
import { SubscriptionsRestService } from "./subscriptions-rest.service";

describe("SubscriptionsRestService", () => {
  let service: SubscriptionsRestService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule(buildTestModuleMetadata({}));
    service = TestBed.inject(SubscriptionsRestService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  describe(".getIdSubscriptionsByStudentAndCourse", () => {
    it("should get list of IdSubscriptions for a students and its courses", () => {
      const personId = 1;
      const courseIds = [11, 12, 13];
      const data: ReadonlyArray<IdSubscription> = [
        buildIdSubscription(1, 11, personId),
        buildIdSubscription(2, 12, personId),
      ];

      const expectedUrl = `https://eventotest.api/Subscriptions/?filter.PersonId==1&filter.EventId=;11,12,13`;

      let result: ReadonlyArray<IdSubscription> | undefined;
      service
        .getIdSubscriptionsByStudentAndCourse(personId, courseIds)
        .subscribe((response) => {
          result = response;
        });

      httpTestingController
        .expectOne(({ url }) => url === expectedUrl, expectedUrl)
        .flush(data);

      httpTestingController.verify();
      expect(result).toEqual(data);
    });
  });
});
