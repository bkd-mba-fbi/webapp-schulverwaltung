import { AsyncPipe, NgClass } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { TranslatePipe, TranslateService } from "@ngx-translate/core";
import { combineLatest, forkJoin } from "rxjs";
import { map, switchMap, take } from "rxjs/operators";
import { BkdModalService } from "src/app/shared/services/bkd-modal.service";
import { SortService } from "src/app/shared/services/sort.service";
import { UserSettingsService } from "src/app/shared/services/user-settings.service";
import { BacklinkComponent } from "../../../shared/components/backlink/backlink.component";
import { SortableHeaderComponent } from "../../../shared/components/sortable-header/sortable-header.component";
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

const SORT_KEYS = ["name", "group"] as const;
export type SortKey = (typeof SORT_KEYS)[number];

@Component({
  selector: "bkd-presence-control-group",
  templateUrl: "./presence-control-group.component.html",
  styleUrls: ["./presence-control-group.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    BacklinkComponent,
    SpinnerComponent,
    AsyncPipe,
    TranslatePipe,
    SortableHeaderComponent,
    NgClass,
  ],
  providers: [PresenceControlGroupSelectionService],
})
export class PresenceControlGroupComponent implements OnInit {
  private route = inject(ActivatedRoute);
  state = inject(PresenceControlStateService);
  selectionService = inject(PresenceControlGroupSelectionService);
  groupService = inject(PresenceControlGroupService);
  private userSettings = inject(UserSettingsService);
  private subscriptionDetailService = inject(SubscriptionDetailsRestService);
  private toastService = inject(ToastService);
  private translate = inject(TranslateService);
  private modalService = inject(BkdModalService);
  private sortService = inject<SortService<SortKey>>(SortService);

  sortKeys = SORT_KEYS;
  backlinkQueryParams$ = this.route.queryParams.pipe(
    map(({ returnparams }) => returnparams),
    map(parseQueryString),
  );

  private eventIds$ = this.state.selectedLesson$.pipe(
    map((lesson) => lesson?.getEventIds() || []),
  );

  sortCriteria = this.sortService.sortCriteria;

  sortedEntries$ = combineLatest([
    this.groupService.getSubscriptionDetailsForStudents(),
    this.sortService.sortCriteria$,
  ]).pipe(map(spread(sortSubscriptionDetails)));

  private selected: ReadonlyArray<SubscriptionDetailWithName> = [];

  constructor() {
    this.sortService.sortCriteria.set({
      primarySortKey: "name",
      ascending: true,
    });
  }

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
}
