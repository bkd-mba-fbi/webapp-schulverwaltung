import { Inject, Injectable } from '@angular/core';
import { combineLatest, Observable, ReplaySubject } from 'rxjs';
import { forkJoin, merge, Subject } from 'rxjs';
import {
  filter,
  map,
  mergeAll,
  switchMap,
  shareReplay,
  startWith,
  defaultIfEmpty,
} from 'rxjs/operators';
import { SETTINGS, Settings } from '../../settings';
import { LessonPresence } from '../../shared/models/lesson-presence.model';
import { SubscriptionDetail } from '../../shared/models/subscription-detail.model';
import {
  GroupViewType,
  UserSetting,
  BaseProperty,
} from '../../shared/models/user-setting.model';
import {
  filterSubscriptionDetailsByGroupId,
  getSubscriptionDetailsWithName,
} from '../utils/subscriptions-details';
import { EventsRestService } from '../../shared/services/events-rest.service';
import { UserSettingsRestService } from '../../shared/services/user-settings-rest.service';
import { decodeArray } from '../../shared/utils/decode';
import { LessonEntry } from '../models/lesson-entry.model';
import {
  findSubscriptionDetailByGroupId,
  SubscriptionDetailWithName,
} from '../utils/subscriptions-details';
import { SubscriptionsRestService } from '../../shared/services/subscriptions-rest.service';
import { spread } from '../../shared/utils/function';
import { LoadingService } from '../../shared/services/loading-service';
import { flatten } from 'lodash-es';

@Injectable()
export class PresenceControlGroupService {
  private selectGroupView$ = new Subject<GroupViewType>();
  private selectedLesson$ = new ReplaySubject<Option<LessonEntry>>();
  private lessonPresences$ = new ReplaySubject<ReadonlyArray<LessonPresence>>();
  private reloadSubscriptionDetails$ = new Subject();

  private defaultGroupView: GroupViewType = { eventId: null, group: null };

  savedGroupViews$ = this.loadSavedGroupViews();

  private savedGroupView$ = this.selectedLesson$.pipe(
    switchMap((lesson) =>
      this.savedGroupViews$.pipe(
        map(
          (views) =>
            views.find((view) => view.eventId === lesson?.getEventIds()[0]) ||
            this.defaultGroupView // TODO helper
        )
      )
    )
  );

  groupView$ = merge(this.selectGroupView$, this.savedGroupView$).pipe(
    startWith(this.defaultGroupView),
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
    this.groupView$,
    this.subscriptionDetails$,
  ]).pipe(
    map(([groupView, details]) =>
      details.filter((d) => d.Value === groupView?.group).map((d) => d.IdPerson)
    ),
    startWith([])
  );

  constructor(
    private settingsService: UserSettingsRestService,
    private eventService: EventsRestService,
    private subscriptionService: SubscriptionsRestService,
    private loadingService: LoadingService,
    @Inject(SETTINGS) private settings: Settings
  ) {}

  selectGroupView(view: GroupViewType): void {
    this.selectGroupView$.next(view);
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

  private loadSavedGroupViews(): Observable<ReadonlyArray<GroupViewType>> {
    return this.settingsService.getUserSettingsCst().pipe(
      map<UserSetting, BaseProperty[]>((i) => i.Settings),
      mergeAll(),
      filter((i) => i.Key === 'presenceControlGroupView'),
      map((v) => JSON.parse(v.Value)),
      switchMap(decodeArray(GroupViewType)),
      defaultIfEmpty([] as ReadonlyArray<GroupViewType>)
    );
  }
}
