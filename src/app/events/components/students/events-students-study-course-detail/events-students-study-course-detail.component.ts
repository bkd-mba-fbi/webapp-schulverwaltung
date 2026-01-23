import { DatePipe } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from "@angular/core";
import { toObservable, toSignal } from "@angular/core/rxjs-interop";
import { ActivatedRoute } from "@angular/router";
import { TranslatePipe, TranslateService } from "@ngx-translate/core";
import {
  Observable,
  Subject,
  combineLatest,
  map,
  of,
  startWith,
  switchMap,
} from "rxjs";
import { SpinnerComponent } from "src/app/shared/components/spinner/spinner.component";
import { BkdModalService } from "src/app/shared/services/bkd-modal.service";
import { LoadingService } from "src/app/shared/services/loading-service";
import { StorageService } from "src/app/shared/services/storage.service";
import { SETTINGS, Settings } from "../../../../settings";
import { BacklinkComponent } from "../../../../shared/components/backlink/backlink.component";
import {
  Subscription,
  SubscriptionDetail,
} from "../../../../shared/models/subscription.model";
import { PersonsRestService } from "../../../../shared/services/persons-rest.service";
import { StatusProcessesRestService } from "../../../../shared/services/status-processes-rest.service";
import { SubscriptionsRestService } from "../../../../shared/services/subscriptions-rest.service";
import { parseQueryString } from "../../../../shared/utils/url";
import { EventsStudentsStudyCourseEditDialogComponent } from "../events-students-study-course-edit-dialog/events-students-study-course-edit-dialog.component";

type SubscriptionDetailsEntry = {
  id: string;
  label: string;
  value: string | number;
  file: Option<string>;
  heading: boolean;
};

@Component({
  selector: "bkd-events-students-study-course-detail",
  imports: [TranslatePipe, DatePipe, BacklinkComponent, SpinnerComponent],
  templateUrl: "./events-students-study-course-detail.component.html",
  styleUrl: "./events-students-study-course-detail.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventsStudentsStudyCourseDetailComponent {
  private settings = inject<Settings>(SETTINGS);
  private route = inject(ActivatedRoute);
  private personsService = inject(PersonsRestService);
  private subscriptionsService = inject(SubscriptionsRestService);
  private storageService = inject(StorageService);
  private statusProcessesService = inject(StatusProcessesRestService);
  private loadingService = inject(LoadingService);
  private modalService = inject(BkdModalService);
  private translate = inject(TranslateService);

  private refreshSubscription = new Subject<void>();

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
  subscription = toSignal(
    this.refreshSubscription.pipe(
      startWith(null),
      switchMap(() => this.loadSubscription()),
    ),
  );
  subscriptionId = computed(() => this.subscription()?.Id ?? null);
  subscriptionDetails = toSignal(this.loadSubscriptionDetails(), {
    initialValue: [] as ReadonlyArray<SubscriptionDetailsEntry>,
  });
  currentStatus = computed(() => ({
    IdStatus: this.subscription()?.StatusId ?? 0,
    Status: this.subscription()?.Status ?? "",
  }));
  backLink = toSignal(
    this.route.queryParams.pipe(
      map(({ returnparams }) => returnparams),
      map(parseQueryString),
    ),
  );
  loading = toSignal(this.loadingService.loading$, { initialValue: true });

  updateStatus(): void {
    const subscriptionId = this.subscriptionId();
    const person = this.person();
    if (!subscriptionId || !person) {
      return;
    }

    const modalRef = this.modalService.open(
      EventsStudentsStudyCourseEditDialogComponent,
    );
    modalRef.componentInstance.currentStatus = this.currentStatus;
    modalRef.componentInstance.subscriptionId = subscriptionId;
    modalRef.componentInstance.personId = person.Id;

    modalRef.result.then(
      (status) => {
        this.statusProcessesService
          .updateStatus(
            "PersonenAnmeldung",
            subscriptionId,
            person.Id,
            status.IdStatus,
          )
          .subscribe(() => this.refreshSubscription.next());
      },
      () => {},
    );
  }

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
        switchMap((id) =>
          id === null
            ? of([])
            : this.subscriptionsService.getSubscriptionDetailsById(id),
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
    let value = detail.Value ?? "";
    value = this.normalizeSubscriptionDetailsDropdownValue(detail, value) ?? "";
    value = this.translateSubscriptionDetailsValue(detail, value) ?? value;
    return {
      id: detail.Id,
      label: detail.VssDesignation,
      value,
      file: this.buildFileUrl(detail),
      heading: detail.VssStyle === "HE",
    };
  }

  private normalizeSubscriptionDetailsDropdownValue(
    detail: SubscriptionDetail,
    value: Option<string | number>,
  ) {
    if (detail.DropdownItems && detail.VssStyle !== "CB") {
      return (
        detail.DropdownItems.find((item) => String(item.Key) === value)
          ?.Value ?? value
      );
    }
    return value;
  }

  private translateSubscriptionDetailsValue(
    details: SubscriptionDetail,
    value: Option<string | number>,
  ) {
    if (details.VssType === "Yes" || details.VssType === "YesNo") {
      return this.translate.instant(
        `events-students.subscriptionDetails.${value}`,
      );
    }
    return value;
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
