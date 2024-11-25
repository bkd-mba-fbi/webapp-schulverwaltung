import { AsyncPipe } from "@angular/common";
import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { TranslatePipe, TranslateService } from "@ngx-translate/core";
import { BehaviorSubject, combineLatest, forkJoin } from "rxjs";
import { map, switchMap, take } from "rxjs/operators";
import { BkdModalService } from "src/app/shared/services/bkd-modal.service";
import { UserSettingsService } from "src/app/shared/services/user-settings.service";
import { BacklinkComponent } from "../../../shared/components/backlink/backlink.component";
import { SpinnerComponent } from "../../../shared/components/spinner/spinner.component";
import { SubscriptionDetailsRestService } from "../../../shared/services/subscription-details-rest.service";
import { ToastService } from "../../../shared/services/toast.service";
import { spread } from "../../../shared/utils/function";
import { parseQueryString } from "../../../shared/utils/url";
import { updateGroupViewSettings } from "../../../shared/utils/user-settings";
import { PresenceControlGroupSelectionService } from "../../services/presence-control-group-selection.service";
import { PresenceControlGroupService } from "../../services/presence-control-group.service";
import { PresenceControlStateService } from "../../services/presence-control-state.service";
import {
  SubscriptionDetailWithName,
  sortSubscriptionDetails,
} from "../../utils/subscriptions-details";
import {
  DialogMode,
  GroupOption,
  PresenceControlGroupDialogComponent,
} from "../presence-control-group-dialog/presence-control-group-dialog.component";

export type PrimarySortKey = "name" | "group";

export interface SortCriteria {
  primarySortKey: PrimarySortKey;
  ascending: boolean;
}
@Component({
  selector: "bkd-presence-control-group",
  templateUrl: "./presence-control-group.component.html",
  styleUrls: ["./presence-control-group.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BacklinkComponent, SpinnerComponent, AsyncPipe, TranslatePipe],
  providers: [PresenceControlGroupSelectionService],
})
export class PresenceControlGroupComponent implements OnInit {
  primarySortKeys: ReadonlyArray<PrimarySortKey> = ["name", "group"];
  backlinkQueryParams$ = this.route.queryParams.pipe(
    map(({ returnparams }) => returnparams),
    map(parseQueryString),
  );

  private eventIds$ = this.state.selectedLesson$.pipe(
    map((lesson) => lesson?.getEventIds() || []),
  );

  private sortCriteriaSubject$ = new BehaviorSubject<SortCriteria>({
    primarySortKey: "name",
    ascending: false,
  });
  sortCriteria$ = this.sortCriteriaSubject$.asObservable();

  sortedEntries$ = combineLatest([
    this.groupService.getSubscriptionDetailsForStudents(),
    this.sortCriteria$,
  ]).pipe(map(spread(sortSubscriptionDetails)));

  private selected: ReadonlyArray<SubscriptionDetailWithName> = [];

  constructor(
    private route: ActivatedRoute,
    public state: PresenceControlStateService,
    public selectionService: PresenceControlGroupSelectionService,
    public groupService: PresenceControlGroupService,
    private userSettings: UserSettingsService,
    private subscriptionDetailService: SubscriptionDetailsRestService,
    private toastService: ToastService,
    private translate: TranslateService,
    private modalService: BkdModalService,
  ) {}

  ngOnInit(): void {
    this.selectionService.selection$.subscribe(
      (selected) => (this.selected = selected as SubscriptionDetailWithName[]),
    );
  }

  selectGroup(): void {
    this.openGroupModal(DialogMode.Select, this.selectCallback.bind(this));
  }

  assignGroup(): void {
    this.openGroupModal(DialogMode.Assign, this.assignCallback.bind(this));
  }

  private openGroupModal(
    dialogMode: DialogMode,
    callback: (selectedGroup: GroupOption) => void,
  ): void {
    combineLatest([
      this.groupService.getSubscriptionDetailsDefinitions(),
      this.groupService.group$,
    ])
      .pipe(take(1))
      .subscribe(([subscriptionDetailsDefinitions, group]) => {
        const modalRef = this.modalService.open(
          PresenceControlGroupDialogComponent,
        );
        modalRef.componentInstance.dialogMode = dialogMode;
        modalRef.componentInstance.subscriptionDetailsDefinitions =
          subscriptionDetailsDefinitions;
        modalRef.componentInstance.group = group;

        modalRef.result.then(
          (selectedGroup) => {
            callback(selectedGroup);
          },
          () => {},
        );
      });
  }

  private selectCallback(selectedGroup: GroupOption): void {
    combineLatest([
      this.eventIds$,
      this.userSettings.getPresenceControlGroupView(),
    ])
      .pipe(
        take(1),
        switchMap(([eventIds, savedGroupViews]) =>
          this.userSettings.savePresenceControlGroupView(
            updateGroupViewSettings(
              selectedGroup.id,
              eventIds,
              savedGroupViews,
            ),
          ),
        ),
        map(() => selectedGroup.id),
      )
      .subscribe((groupId) => this.groupService.selectGroup(groupId));
  }

  private assignCallback(selectedGroup: GroupOption): void {
    forkJoin(
      this.selected.map((s) =>
        this.subscriptionDetailService.update(selectedGroup.id, s.detail),
      ),
    ).subscribe(this.onSaveSuccess.bind(this));
  }

  private onSaveSuccess(): void {
    this.groupService.reloadSubscriptionDetails();
    this.selectionService.clear();

    this.toastService.success(
      this.translate.instant(
        "presence-control.groups.notifications.save-success",
      ),
    );
  }

  getSortDirectionCharacter(
    sortCriteria: SortCriteria,
    sortKey: PrimarySortKey,
  ): string {
    if (sortCriteria.primarySortKey !== sortKey) {
      return "";
    }
    return sortCriteria.ascending ? "↓" : "↑";
  }

  /**
   * Switches primary sort key or toggles sort direction, if already
   * sorted by given key.
   */
  toggleSort(primarySortKey: PrimarySortKey): void {
    this.sortCriteriaSubject$.pipe(take(1)).subscribe((criteria) => {
      if (criteria.primarySortKey === primarySortKey) {
        // Change sort direction
        this.sortCriteriaSubject$.next({
          primarySortKey,
          ascending: !criteria.ascending,
        });
      } else {
        // Change sort key
        this.sortCriteriaSubject$.next({
          primarySortKey,
          ascending: primarySortKey === "name",
        });
      }
    });
  }
}
