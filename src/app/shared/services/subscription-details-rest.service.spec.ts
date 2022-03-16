import { HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { buildTestModuleMetadata } from '../../../spec-helpers';
import { isEqual } from 'lodash-es';

import { SubscriptionDetailsRestService } from './subscription-details-rest.service';
import { buildSubscriptionDetail } from '../../../spec-builders';

describe('SubscriptionDetailsRestService', () => {
  let service: SubscriptionDetailsRestService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule(buildTestModuleMetadata({}));
    service = TestBed.inject(SubscriptionDetailsRestService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  describe('.update', () => {
    it('adds group A to the given subscription', () => {
      const url = 'https://eventotest.api/SubscriptionDetails/1';
      const detail = buildSubscriptionDetail(3843, '');
      const body = {
        IdPerson: 1,
        EventId: 1,
        Value: 'A',
      };
      service
        .update('A', detail)
        .subscribe((result) => expect(result).toBeUndefined());

      httpTestingController
        .expectOne(
          (req) =>
            req.url === url && req.method === 'PUT' && isEqual(req.body, body),
          url
        )
        .flush(body);
      httpTestingController.verify();
    });

    it('removes the group from the given subscription', () => {
      const url = 'https://eventotest.api/SubscriptionDetails/1';
      const detail = buildSubscriptionDetail(3843, 'B');
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
            req.url === url && req.method === 'PUT' && isEqual(req.body, body),
          url
        )
        .flush(body);
      httpTestingController.verify();
    });
  });
});
