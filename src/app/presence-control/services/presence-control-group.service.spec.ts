import { HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import * as t from 'io-ts/lib/index';
import { Subject } from 'rxjs';
import { buildLesson, buildSubscriptionDetail } from '../../../spec-builders';
import { buildTestModuleMetadata } from '../../../spec-helpers';
import { SubscriptionDetail } from '../../shared/models/subscription-detail.model';
import { fromLesson, LessonEntry } from '../models/lesson-entry.model';
import { PresenceControlGroupService } from './presence-control-group.service';

describe('PresenceControlGroupService', () => {
  let service: PresenceControlGroupService;
  let httpTestingController: HttpTestingController;

  let subscriptionDetails: SubscriptionDetail[];
  let selectedLesson: Option<LessonEntry>;

  let selectedLesson$: Subject<Option<LessonEntry>>;

  beforeEach(() => {
    TestBed.configureTestingModule(
      buildTestModuleMetadata({ providers: [PresenceControlGroupService] })
    );
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(PresenceControlGroupService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  describe('groupsAvailability$', () => {
    beforeEach(() => {
      selectedLesson$ = new Subject();

      selectedLesson = fromLesson(
        buildLesson(
          2,
          new Date(2000, 0, 23, 8, 0),
          new Date(2000, 0, 23, 9, 0),
          'Deutsch',
          'Dora Durrer',
          undefined,
          333
        )
      );
    });

    it('returns true if the selected lesson has groups available', () => {
      const subscriptionDetailWithGroups = buildSubscriptionDetail(3843);
      subscriptionDetails = [subscriptionDetailWithGroups];

      service.groupsAvailability$.subscribe((result) =>
        expect(result).toBeTruthy()
      );

      service.setSelectedLesson(selectedLesson);

      expectSubscriptionDetailRequest(333);
    });

    it('returns false if the selected lesson does not have groups available', () => {
      const subscriptionDetailWithoutGroups = buildSubscriptionDetail(3333);
      subscriptionDetails = [subscriptionDetailWithoutGroups];

      service.groupsAvailability$.subscribe((result) =>
        expect(result).toBeFalsy()
      );

      service.setSelectedLesson(selectedLesson);

      expectSubscriptionDetailRequest(333);
    });
  });

  function expectSubscriptionDetailRequest(
    eventId: number,
    response = subscriptionDetails
  ): void {
    const url = `https://eventotest.api/Events/${eventId}/SubscriptionDetails`;
    httpTestingController
      .expectOne(url)
      .flush(t.array(SubscriptionDetail).encode(response));
  }
});
