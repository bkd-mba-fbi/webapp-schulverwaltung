import { HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { buildIdSubscription } from 'src/spec-builders';
import { buildTestModuleMetadata } from '../../../spec-helpers';
import { IdSubscription } from '../models/subscription-detail.model';

import { SubscriptionsRestService } from './subscriptions-rest.service';

describe('SubscriptionsRestService', () => {
  let service: SubscriptionsRestService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule(buildTestModuleMetadata({}));
    service = TestBed.inject(SubscriptionsRestService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  describe('.getByRegistrationId', () => {
    const data: any[] = [];

    it('gets the list of subscription details for the given registration id', () => {
      const url =
        'https://eventotest.api/Subscriptions/1234/SubscriptionDetails';

      service
        .getListByRegistrationId(1234)
        .subscribe((result) => expect(result).toBe(data));

      httpTestingController
        .expectOne((req) => req.url === url, url)
        .flush(data);
      httpTestingController.verify();
    });
  });

  describe('getIdSubscriptionsByStudentAndCourse', () => {
    it('should get list of IdSubscriptions for a students and its courses', () => {
      const personId = 1;
      const courseIds = [11, 12, 13];
      const data: ReadonlyArray<IdSubscription> = [
        buildIdSubscription(1, 11, personId),
        buildIdSubscription(2, 12, personId),
      ];

      const expectedUrl = `https://eventotest.api/Subscriptions/?filter.PersonId==1&filter.EventId==11,12,13`;

      let result: ReadonlyArray<IdSubscription> | undefined;
      service
        .getIdSubscriptionsByStudentAndCourse(personId, courseIds)
        .subscribe((response) => {
          result = response;
        });

      const request = httpTestingController.expectOne(
        ({ url }) => url === expectedUrl,
        expectedUrl
      );
      request.flush(data);

      httpTestingController.verify();
      expect(result).toEqual(data);
    });
  });
});
