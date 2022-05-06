import { HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import {
  buildIdSubscription,
  buildSubscriptionDetail,
} from 'src/spec-builders';
import { buildTestModuleMetadata } from '../../../spec-helpers';
import {
  IdSubscription,
  SubscriptionDetail,
} from '../models/subscription-detail.model';

import { SubscriptionsRestService } from './subscriptions-rest.service';

describe('SubscriptionsRestService', () => {
  let service: SubscriptionsRestService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule(buildTestModuleMetadata({}));
    service = TestBed.inject(SubscriptionsRestService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('gets the list of subscription details for the given registration id', () => {
    const data: ReadonlyArray<SubscriptionDetail> = [
      buildSubscriptionDetail(1),
      buildSubscriptionDetail(2),
    ];

    const expectedUrl =
      'https://eventotest.api/Subscriptions/1234/SubscriptionDetails';

    let result: ReadonlyArray<SubscriptionDetail> = [];
    service
      .getListByRegistrationId(1234)
      .subscribe((response) => (result = response));

    httpTestingController
      .expectOne(({ url }) => url === expectedUrl, expectedUrl)
      .flush(data);

    httpTestingController.verify();
    expect(result).toEqual(data);
  });

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

    httpTestingController
      .expectOne(({ url }) => url === expectedUrl, expectedUrl)
      .flush(data);

    httpTestingController.verify();
    expect(result).toEqual(data);
  });
});
