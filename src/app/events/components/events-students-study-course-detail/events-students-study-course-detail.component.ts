import { DatePipe } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  computed,
} from "@angular/core";
import { toObservable, toSignal } from "@angular/core/rxjs-interop";
import { ActivatedRoute } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { Observable, filter, map, switchMap, tap } from "rxjs";
import { SETTINGS, Settings } from "../../../settings";
import { BacklinkComponent } from "../../../shared/components/backlink/backlink.component";
import { SubscriptionDetail } from "../../../shared/models/subscription.model";
import { PersonsRestService } from "../../../shared/services/persons-rest.service";
import { StorageService } from "../../../shared/services/storage.service";
import { SubscriptionsRestService } from "../../../shared/services/subscriptions-rest.service";
import { notNull } from "../../../shared/utils/filter";
import { EventsStudentsStateService } from "../../services/events-students-state.service";

type SubscriptionDetailsEntry = {
  id: string;
  label: string;
  value: string;
  file: Option<string>;
};

@Component({
  selector: "bkd-events-students-study-course-detail",
  standalone: true,
  imports: [BacklinkComponent, DatePipe, TranslateModule],
  templateUrl: "./events-students-study-course-detail.component.html",
  styleUrl: "./events-students-study-course-detail.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventsStudentsStudyCourseDetailComponent {
  person = toSignal(
    this.route.paramMap.pipe(
      map((params) => params.get("id")),
      switchMap((id) => this.personService.get(Number(id))),
    ),
    { initialValue: null },
  );
  studentEntry = computed(
    () =>
      this.state.entries().filter((entry) => entry.id === this.person()?.Id)[0],
  );
  subscriptionId = computed(() => this.studentEntry()?.subscriptionId ?? null);
  subscriptionDetails = toSignal(this.loadSubscriptionDetails(), {
    initialValue: [] as ReadonlyArray<SubscriptionDetailsEntry>,
  });

  constructor(
    @Inject(SETTINGS) private settings: Settings,
    private route: ActivatedRoute,
    private personService: PersonsRestService,
    private subscriptionService: SubscriptionsRestService,
    private state: EventsStudentsStateService,
    private storageService: StorageService,
  ) {}

  private loadSubscriptionDetails(): Observable<
    ReadonlyArray<SubscriptionDetailsEntry>
  > {
    return toObservable(this.subscriptionId).pipe(
      filter(notNull),
      switchMap((id) =>
        this.subscriptionService.getSubscriptionDetailsById(id),
      ),
      map((details) =>
        details.map((detail) => this.toSubscriptionDetailsEntry(detail)),
      ),
      tap((details) => console.log(details)),
    );
  }

  private toSubscriptionDetailsEntry(
    detail: SubscriptionDetail,
  ): SubscriptionDetailsEntry {
    return {
      id: detail.Id,
      label: detail.VssDesignation,
      value: detail.Value || "",
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
