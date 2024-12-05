import { DatePipe } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  computed,
} from "@angular/core";
import { toObservable, toSignal } from "@angular/core/rxjs-interop";
import { ActivatedRoute } from "@angular/router";
import { TranslatePipe } from "@ngx-translate/core";
import { Observable, combineLatest, filter, map, of, switchMap } from "rxjs";
import { SpinnerComponent } from "src/app/shared/components/spinner/spinner.component";
import { LoadingService } from "src/app/shared/services/loading-service";
import { SETTINGS, Settings } from "../../../settings";
import { BacklinkComponent } from "../../../shared/components/backlink/backlink.component";
import {
  Subscription,
  SubscriptionDetail,
} from "../../../shared/models/subscription.model";
import { PersonsRestService } from "../../../shared/services/persons-rest.service";
import { StorageService } from "../../../shared/services/storage.service";
import { SubscriptionsRestService } from "../../../shared/services/subscriptions-rest.service";
import { notNull } from "../../../shared/utils/filter";
import { parseQueryString } from "../../../shared/utils/url";

type SubscriptionDetailsEntry = {
  id: string;
  label: string;
  value: string;
  file: Option<string>;
};

@Component({
  selector: "bkd-events-students-study-course-detail",
  imports: [TranslatePipe, DatePipe, BacklinkComponent, SpinnerComponent],
  templateUrl: "./events-students-study-course-detail.component.html",
  styleUrl: "./events-students-study-course-detail.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventsStudentsStudyCourseDetailComponent {
  eventId$ =
    this.route.parent?.paramMap.pipe(
      map((params) => Number(params.get("id"))),
    ) ?? of(0);
  personId$ = this.route.paramMap.pipe(
    map((params) => Number(params.get("id"))),
  );
  person = toSignal(
    this.personId$.pipe(switchMap((id) => this.personsService.get(id))),
    { initialValue: null },
  );
  subscription = toSignal(this.loadSubscription());
  subscriptionId = computed(() => this.subscription()?.Id ?? null);
  subscriptionDetails = toSignal(this.loadSubscriptionDetails(), {
    initialValue: [] as ReadonlyArray<SubscriptionDetailsEntry>,
  });
  backLink = toSignal(
    this.route.queryParams.pipe(
      map(({ returnparams }) => returnparams),
      map(parseQueryString),
    ),
  );
  loading = toSignal(this.loadingService.loading$, { initialValue: true });

  constructor(
    @Inject(SETTINGS) private settings: Settings,
    private route: ActivatedRoute,
    private personsService: PersonsRestService,
    private subscriptionsService: SubscriptionsRestService,
    private storageService: StorageService,
    private loadingService: LoadingService,
  ) {}

  private loadSubscription(): Observable<Option<Subscription>> {
    return this.loadingService.load(
      combineLatest([this.eventId$, this.personId$]).pipe(
        switchMap(([eventId, personId]) =>
          this.subscriptionsService.getSubscriptionsByCourse(eventId, {
            "filter.PersonId": `=${personId}`,
          }),
        ),
        map((subscriptions) => subscriptions[0] ?? null),
      ),
      { stopOnFirstValue: true },
    );
  }

  private loadSubscriptionDetails(): Observable<
    ReadonlyArray<SubscriptionDetailsEntry>
  > {
    return this.loadingService.load(
      toObservable(this.subscriptionId).pipe(
        filter(notNull),
        switchMap((id) =>
          this.subscriptionsService.getSubscriptionDetailsById(id),
        ),
        map((details) =>
          details.map((detail) => this.toSubscriptionDetailsEntry(detail)),
        ),
      ),
      { stopOnFirstValue: true },
    );
  }

  private toSubscriptionDetailsEntry(
    detail: SubscriptionDetail,
  ): SubscriptionDetailsEntry {
    return {
      id: detail.Id,
      label: detail.VssDesignation,
      value: detail.Value ?? "",
      file: this.buildFileUrl(detail),
    };
  }

  private buildFileUrl(detail: SubscriptionDetail): Option<string> {
    if (
      detail.VssStyle === "PD" ||
      detail.VssStyle === "PF" ||
      detail.VssStyle === "DA"
    ) {
      const accessToken = this.storageService.getAccessToken() || "";
      return `${this.settings.apiUrl}/Files/SubscriptionDetails/${detail.Id}?token=${accessToken}`;
    }
    return null;
  }
}
