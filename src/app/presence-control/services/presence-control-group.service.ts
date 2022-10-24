import { Inject, Injectable } from '@angular/core';
import { combineLatest, Observable, ReplaySubject } from 'rxjs';
import { forkJoin, merge, Subject } from 'rxjs';
import { map, switchMap, shareReplay, startWith } from 'rxjs/operators';
import { SETTINGS, Settings } from '../../settings';
import { LessonPresence } from '../../shared/models/lesson-presence.model';
import { SubscriptionDetail } from '../../shared/models/subscription-detail.model';
import {
  filterSubscriptionDetailsByGroupId,
  getSubscriptionDetailsWithName,
} from '../utils/subscriptions-details';
import { EventsRestService } from '../../shared/services/events-rest.service';
import { LessonEntry } from '../models/lesson-entry.model';
import {
  findSubscriptionDetailByGroupId,
  SubscriptionDetailWithName,
} from '../utils/subscriptions-details';
import { SubscriptionsRestService } from '../../shared/services/subscriptions-rest.service';
import { spread } from '../../shared/utils/function';
import { LoadingService } from '../../shared/services/loading-service';
import { flatten } from 'lodash-es';
import { UserSettingsService } from 'src/app/shared/services/user-settings.service';
import { PresenceControlGroupViewEntry } from 'src/app/shared/models/user-settings.model';

@Injectable()
export class PresenceControlGroupService {
  private selectGroup$ = new Subject<Option<string>>();
  private selectedLesson$ = new ReplaySubject<Option<LessonEntry>>();
  private lessonPresences$ = new ReplaySubject<ReadonlyArray<LessonPresence>>();
  private reloadSubscriptionDetails$ = new Subject();

  private defaultGroup: Option<string> = null;

  private savedGroup$ = this.selectedLesson$.pipe(
    switchMap((lesson) =>
      this.userSettings
        .getPresenceControlGroupView()
        .pipe(map((views) => this.findGroupByLesson(views, lesson)))
    )
  );

  group$ = merge(this.selectGroup$, this.savedGroup$).pipe(
    startWith(this.defaultGroup),
    shareReplay(1)
  );

  private subscriptionsDetailsByEvents$ = this.selectedLesson$.pipe(
    map((lesson) => lesson?.getEventIds() || []),
    switchMap((ids) =>
      forkJoin(ids.map((id) => this.eventService.getSubscriptionDetails(id)))
    ),
    shareReplay(1)
  );

  /**
   * Check if all events in the selected lesson have groups available
   * Groups are available if the subscriptionDetailGroupId is found on the subscription detail of the given event
   *
   */
  groupsAvailability$ = this.subscriptionsDetailsByEvents$.pipe(
    map((detailsByEvent) =>
      detailsByEvent.every((details) =>
        findSubscriptionDetailByGroupId(details, this.settings)
      )
    ),
    shareReplay(1)
  );

  private selectedLessonRegistrationIds$ = combineLatest([
    this.selectedLesson$,
    this.lessonPresences$,
  ]).pipe(
    map(([lesson, presences]) =>
      presences.filter((presence) =>
        lesson?.getIds().includes(presence.LessonRef.Id)
      )
    ),
    map(
      (presences) =>
        presences
          .map((presence) => presence.RegistrationRef.Id)
          .filter((i) => i) as number[]
    )
  );

  private subscriptionsDetailsByRegistrations$ = combineLatest([
    this.selectedLessonRegistrationIds$,
    this.groupsAvailability$,
    this.reloadSubscriptionDetails$.pipe(startWith(undefined)),
  ]).pipe(
    switchMap(([ids, groupsAvailable]) =>
      forkJoin(
        ids.map((id) =>
          groupsAvailable ? this.loadSubscriptionDetails(id) : []
        )
      )
    )
  );

  private subscriptionDetails$ = this.subscriptionsDetailsByRegistrations$.pipe(
    map(flatten),
    map((details) =>
      filterSubscriptionDetailsByGroupId(details, this.settings)
    ),
    shareReplay(1)
  );

  subscriptionDetailPersonIds$ = combineLatest([
    this.group$,
    this.subscriptionDetails$,
  ]).pipe(
    map(([group, details]) =>
      details.filter((d) => d.Value === group).map((d) => d.IdPerson)
    ),
    startWith([])
  );

  constructor(
    private userSettings: UserSettingsService,
    private eventService: EventsRestService,
    private subscriptionService: SubscriptionsRestService,
    private loadingService: LoadingService,
    @Inject(SETTINGS) private settings: Settings
  ) {}

  selectGroup(groupId: Option<string>): void {
    this.selectGroup$.next(groupId);
  }

  setSelectedLesson(selected: Option<LessonEntry>): void {
    this.selectedLesson$.next(selected);
  }

  setLessonPresences(presences: ReadonlyArray<LessonPresence>): void {
    this.lessonPresences$.next(presences);
  }

  getSubscriptionDetailForGroupEvent(): Observable<Maybe<SubscriptionDetail>> {
    return this.subscriptionsDetailsByEvents$.pipe(
      map(flatten),
      map((details) => findSubscriptionDetailByGroupId(details, this.settings))
    );
  }

  /**
   * Get all subscription details with groups for the selected students and mapped the details with the student's name
   * Groups are available if the subscriptionDetailGroupId is found on the given subscription detail
   *
   */
  getSubscriptionDetailsForStudents(): Observable<
    ReadonlyArray<SubscriptionDetailWithName>
  > {
    return combineLatest([
      this.subscriptionDetails$,
      this.lessonPresences$,
    ]).pipe(map(spread(getSubscriptionDetailsWithName)));
  }

  reloadSubscriptionDetails(): void {
    this.reloadSubscriptionDetails$.next(undefined);
  }

  private loadSubscriptionDetails(
    id: number
  ): Observable<ReadonlyArray<SubscriptionDetail>> {
    return this.loadingService.load(
      this.subscriptionService.getListByRegistrationId(id)
    );
  }

  private findGroupByLesson(
    groupViews: ReadonlyArray<PresenceControlGroupViewEntry>,
    lesson: Option<LessonEntry>
  ): Option<string> {
    const groupView = groupViews.find(
      (gv) => gv.eventId === lesson?.getEventIds()[0] // All event ids of a lesson share the same group
    );

    return groupView?.group || this.defaultGroup;
  }
}
