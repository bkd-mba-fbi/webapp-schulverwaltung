import { HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { buildTestModuleMetadata } from '../../../spec-helpers';

import { EventsRestService } from './events-rest.service';

describe('EventsRestService', () => {
  let service: EventsRestService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule(buildTestModuleMetadata({}));
    service = TestBed.inject(EventsRestService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  describe('.getSubscriptionDetails', () => {
    const data: any[] = [];

    it('gets the list of subscription details for the given event id', () => {
      const url = 'https://eventotest.api/Events/1234/SubscriptionDetails';

      service
        .getSubscriptionDetails(1234)
        .subscribe((result) => expect(result).toBe(data));

      httpTestingController
        .expectOne((req) => req.url === url, url)
        .flush(data);
    });
  });
});
