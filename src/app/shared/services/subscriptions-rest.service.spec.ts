import { HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { buildTestModuleMetadata } from '../../../spec-helpers';

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
});