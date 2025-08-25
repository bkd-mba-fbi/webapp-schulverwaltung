import { HttpTestingController } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { buildSubscription, buildSubscriptionDetail } from "src/spec-builders";
import { buildTestModuleMetadata } from "../../../spec-helpers";
import { Subscription, SubscriptionDetail } from "../models/subscription.model";
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
      const data: ReadonlyArray<Subscription> = [
        buildSubscription(1, 11, personId),
        buildSubscription(2, 12, personId),
      ];

      const expectedUrl = `https://eventotest.api/Subscriptions/?filter.PersonId==1&filter.EventId=;11,12,13`;

      let result: ReadonlyArray<number> | undefined;
      service
        .getSubscriptionIdsByStudentAndCourse(personId, courseIds)
        .subscribe((response) => {
          result = response;
        });

      httpTestingController
        .expectOne(
          ({ urlWithParams }) => urlWithParams === expectedUrl,
          expectedUrl,
        )
        .flush(data);

      httpTestingController.verify();
      expect(result).toEqual(data.map((s) => s.Id));
    });
  });

  describe(".getSubscriptionsByCourse", () => {
    it("should get list of Subscriptions for a course", () => {
      const courseId = 9704;
      const data: ReadonlyArray<Subscription> = [
        buildSubscription(1, 11, courseId),
      ];

      const expectedUrl = `https://eventotest.api/Subscriptions/?filter.EventId==9704&fields=Id,EventId,EventDesignation,PersonId,Status,StatusId,RegistrationDate`;

      let result: ReadonlyArray<Subscription> | undefined;
      service.getSubscriptionsByCourse(courseId).subscribe((response) => {
        result = response;
      });

      httpTestingController
        .expectOne(
          ({ urlWithParams }) => urlWithParams === expectedUrl,
          expectedUrl,
        )
        .flush(data);

      httpTestingController.verify();
      expect(result).toEqual(data);
    });

    it("should get list of Subscriptions for a course with additional params", () => {
      const courseId = 9704;
      const data: ReadonlyArray<Subscription> = [
        buildSubscription(1, 11, courseId),
      ];
      const expectedUrl = `https://eventotest.api/Subscriptions/?filter.EventId==9704&filter.IsOkay==1&fields=Id,EventId,EventDesignation,PersonId,Status,StatusId,RegistrationDate`;

      let result: ReadonlyArray<Subscription> | undefined;
      service
        .getSubscriptionsByCourse(courseId, {
          "filter.IsOkay": "=1",
        })
        .subscribe((response) => {
          result = response;
        });

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

  describe(".getSubscriptionDetailsById", () => {
    it("should get list of SubscriptionDetails for a subscription id", () => {
      const subscriptionId = 1;
      const data: ReadonlyArray<SubscriptionDetail> = [
        buildSubscriptionDetail(1),
        buildSubscriptionDetail(2),
      ];

      const expectedUrl = `https://eventotest.api/Subscriptions/${subscriptionId}/SubscriptionDetails`;

      let result: ReadonlyArray<SubscriptionDetail> | undefined;
      service
        .getSubscriptionDetailsById(subscriptionId)
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
