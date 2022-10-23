import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, combineLatest, forkJoin } from 'rxjs';
import { map, mapTo, pluck, switchMap, take } from 'rxjs/operators';
import { SubscriptionDetailsRestService } from '../../../shared/services/subscription-details-rest.service';
import { UserSettingsRestService } from '../../../shared/services/user-settings-rest.service';
import { spread } from '../../../shared/utils/function';
import { parseQueryString } from '../../../shared/utils/url';
import {
  updateGroupViewSettings,
  getUserSetting,
} from '../../../shared/utils/user-settings';
import { PresenceControlGroupSelectionService } from '../../services/presence-control-group-selection.service';
import { PresenceControlGroupService } from '../../services/presence-control-group.service';
import { PresenceControlStateService } from '../../services/presence-control-state.service';
import {
  sortSubscriptionDetails,
  SubscriptionDetailWithName,
} from '../../utils/subscriptions-details';
import {
  GroupOptions,
  PresenceControlGroupDialogComponent,
  DialogMode,
} from '../presence-control-group-dialog/presence-control-group-dialog.component';
import { ToastService } from '../../../shared/services/toast.service';

export type PrimarySortKey = 'name' | 'group';

export interface SortCriteria {
  primarySortKey: PrimarySortKey;
  ascending: boolean;
}
@Component({
  selector: 'erz-presence-control-group',
  templateUrl: './presence-control-group.component.html',
  styleUrls: ['./presence-control-group.component.scss'],
  providers: [PresenceControlGroupSelectionService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PresenceControlGroupComponent implements OnInit {
  backlinkQueryParams$ = this.route.queryParams.pipe(
    pluck('returnparams'),
    map(parseQueryString)
  );

  private eventIds$ = this.state.selectedLesson$.pipe(
    map((lesson) => lesson?.getEventIds() || [])
  );

  private sortCriteriaSubject$ = new BehaviorSubject<SortCriteria>({
    primarySortKey: 'name',
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
    private settingsService: UserSettingsRestService,
    private subscriptionDetailService: SubscriptionDetailsRestService,
    private toastService: ToastService,
    private translate: TranslateService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.selectionService.selection$.subscribe(
      (selected) => (this.selected = selected as SubscriptionDetailWithName[])
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
    callback: (selectedGroup: GroupOptions) => void
  ): void {
    combineLatest([
      this.groupService.getSubscriptionDetailForGroupEvent(),
      this.groupService.group$,
    ])
      .pipe(take(1))
      .subscribe(([subscriptionDetail, group]) => {
        const modalRef = this.modalService.open(
          PresenceControlGroupDialogComponent
        );
        modalRef.componentInstance.dialogMode = dialogMode;
        modalRef.componentInstance.subscriptionDetail = subscriptionDetail;
        modalRef.componentInstance.group = group;

        modalRef.result.then(
          (selectedGroup) => {
            callback(selectedGroup);
          },
          () => {}
        );
      });
  }

  private selectCallback(selectedGroup: GroupOptions): void {
    combineLatest([this.eventIds$, this.groupService.savedGroupViews$])
      .pipe(
        take(1),
        switchMap(([eventIds, savedGroupViews]) => {
          const propertyBody = updateGroupViewSettings(
            selectedGroup.id,
            eventIds,
            savedGroupViews
          );
          const cst = getUserSetting('presenceControlGroupView', propertyBody);

          return this.settingsService
            .updateUserSettingsCst(cst)
            .pipe(mapTo(selectedGroup.id));
        })
      )
      .subscribe((groupId) => this.groupService.selectGroup(groupId));
  }

  private assignCallback(selectedGroup: GroupOptions): void {
    forkJoin(
      this.selected.map((s) =>
        this.subscriptionDetailService.update(selectedGroup.id, s.detail)
      )
    ).subscribe(this.onSaveSuccess.bind(this));
  }

  private onSaveSuccess(): void {
    this.groupService.reloadSubscriptionDetails();
    this.selectionService.clear();

    this.toastService.success(
      this.translate.instant(
        'presence-control.groups.notifications.save-success'
      )
    );
  }

  getSortDirectionCharacter(
    sortCriteria: SortCriteria,
    sortKey: PrimarySortKey
  ): string {
    if (sortCriteria.primarySortKey !== sortKey) {
      return '';
    }
    return sortCriteria.ascending ? '↓' : '↑';
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
          ascending: primarySortKey === 'name',
        });
      }
    });
  }
}
