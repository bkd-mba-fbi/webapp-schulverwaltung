import { Inject, Injectable } from "@angular/core";
import { flatten, uniq } from "lodash-es";
import { Observable, ReplaySubject, combineLatest, of } from "rxjs";
import { Subject, forkJoin, merge } from "rxjs";
import { map, shareReplay, startWith, switchMap } from "rxjs/operators";
import { PresenceControlGroupViewEntry } from "src/app/shared/models/user-settings.model";
import { UserSettingsService } from "src/app/shared/services/user-settings.service";
import { SETTINGS, Settings } from "../../settings";
import { LessonPresence } from "../../shared/models/lesson-presence.model";
import { SubscriptionDetail } from "../../shared/models/subscription-detail.model";
import { EventsRestService } from "../../shared/services/events-rest.service";
import { LoadingService } from "../../shared/services/loading-service";
import { SubscriptionDetailsRestService } from "../../shared/services/subscription-details-rest.service";
import { spread } from "../../shared/utils/function";
import { GroupOption } from "../components/presence-control-group-dialog/presence-control-group-dialog.component";
import { LessonEntry } from "../models/lesson-entry.model";
import {
  filterSubscriptionDetailsByGroupId,
  getSubscriptionDetailsWithName,
} from "../utils/subscriptions-details";
import {
  SubscriptionDetailWithName,
  findSubscriptionDetailByGroupId,
} from "../utils/subscriptions-details";

const GROUP_LOADING_CONTEXT = "presence-control-group";

@Injectable()
export class PresenceControlGroupService {
  private selectGroup$ = new Subject<GroupOption["id"]>();
  private selectedLesson$ = new ReplaySubject<Option<LessonEntry>>();
  private lessonPresences$ = new ReplaySubject<ReadonlyArray<LessonPresence>>();
  private reloadSubscriptionDetails$ = new Subject();

  private defaultGroup: Option<string> = null;

  private savedGroup$ = this.selectedLesson$.pipe(
    switchMap((lesson) =>
      this.userSettings
        .getPresenceControlGroupView()
        .pipe(map((views) => this.findGroupByLesson(views, lesson))),
    ),
  );

  group$ = merge(this.selectGroup$, this.savedGroup$).pipe(
    startWith(this.defaultGroup),
    shareReplay(1),
  );

  loading$ = this.loadingService.loading(GROUP_LOADING_CONTEXT);

  private subscriptionDetailsDefinitions$ = this.selectedLesson$.pipe(
    map((lesson) => lesson?.getEventIds() || []),
    switchMap((ids) =>
      forkJoin(
        ids.map((id) =>
          this.eventService.getSubscriptionDetailsDefinitions(id),
        ),
      ),
    ),
    shareReplay(1),
  );

  /**
   * Check if all events in the selected lesson have groups available
   * Groups are available if the subscriptionDetailGroupId is found on the subscription detail of the given event
   *
   */
  groupsAvailability$ = this.subscriptionDetailsDefinitions$.pipe(
    map((detailsByEvent) =>
      detailsByEvent.every((details) =>
        findSubscriptionDetailByGroupId(details, this.settings),
      ),
    ),
    shareReplay(1),
  );

  private subscriptionDetails$ = combineLatest([
    this.selectedLesson$,
    this.groupsAvailability$,
    this.reloadSubscriptionDetails$.pipe(
      map(() => false),
      startWith(true),
    ),
  ]).pipe(
    switchMap(([lesson, groupsAvailability, initial]) =>
      lesson && groupsAvailability
        ? this.loadSubscriptionDetailsForLesson(lesson, initial)
        : of([]),
    ),
    map((details) =>
      filterSubscriptionDetailsByGroupId(details, this.settings),
    ),
    shareReplay(1),
  );

  subscriptionDetailPersonIds$ = combineLatest([
    this.group$,
    this.subscriptionDetails$,
  ]).pipe(
    map(([group, details]) =>
      details.filter((d) => d.Value === group).map((d) => d.IdPerson),
    ),
    startWith([]),
  );

  constructor(
    private userSettings: UserSettingsService,
    private eventService: EventsRestService,
    private subscriptionDetailsService: SubscriptionDetailsRestService,
    private loadingService: LoadingService,
    @Inject(SETTINGS) private settings: Settings,
  ) {}

  selectGroup(groupId: GroupOption["id"]): void {
    this.selectGroup$.next(groupId);
  }

  setSelectedLesson(selected: Option<LessonEntry>): void {
    this.selectedLesson$.next(selected);
  }

  setLessonPresences(presences: ReadonlyArray<LessonPresence>): void {
    this.lessonPresences$.next(presences);
  }

  getSubscriptionDetailsDefinitions(): Observable<Maybe<SubscriptionDetail>> {
    return this.subscriptionDetailsDefinitions$.pipe(
      map(flatten),
      map((details) => findSubscriptionDetailByGroupId(details, this.settings)),
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

  private loadSubscriptionDetailsForLesson(
    lesson: LessonEntry,
    initial = true,
  ): Observable<ReadonlyArray<SubscriptionDetail>> {
    return this.loadingService
      .load(
        forkJoin(
          uniq(lesson.getEventIds()).map((eventId) =>
            this.subscriptionDetailsService.getListForEvent(eventId),
          ),
        ),
        !initial ? GROUP_LOADING_CONTEXT : undefined,
      )
      .pipe(map(flatten));
  }

  private findGroupByLesson(
    groupViews: ReadonlyArray<PresenceControlGroupViewEntry>,
    lesson: Option<LessonEntry>,
  ): GroupOption["id"] {
    const groupView = groupViews.find(
      (gv) => gv.eventId === lesson?.getEventIds()[0], // All event ids of a lesson share the same group
    );

    return groupView?.group || this.defaultGroup;
  }
}
