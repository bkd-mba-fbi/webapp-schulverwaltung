import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { map, pluck, take } from 'rxjs/operators';
import { GroupViewType } from '../../../shared/models/user-setting.model';
import { SubscriptionDetailsRestService } from '../../../shared/services/subscription-details-rest.service';
import { UserSettingsRestService } from '../../../shared/services/user-settings-rest.service';
import { spread } from '../../../shared/utils/function';
import { parseQueryString } from '../../../shared/utils/url';
import { getUserSetting } from '../../../shared/utils/user-settings';
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
} from '../presence-control-group-dialog/presence-control-group-dialog.component';

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
  saving$ = new BehaviorSubject(false);

  backlinkQueryParams$ = this.route.queryParams.pipe(
    pluck('returnparams'),
    map(parseQueryString)
  );

  lessonId$ = this.route.paramMap.pipe(
    map((params) => Number(params.get('id')))
  );

  private sortCriteriaSubject$ = new BehaviorSubject<SortCriteria>({
    primarySortKey: 'name',
    ascending: false,
  });
  sortCriteria$ = this.sortCriteriaSubject$.asObservable();

  sortedEntries$ = combineLatest([
    this.state.getSubscriptionDetailsForStudents(),
    this.sortCriteria$,
  ]).pipe(map(spread(sortSubscriptionDetails)));

  selected: ReadonlyArray<SubscriptionDetailWithName> = [];

  constructor(
    private route: ActivatedRoute,
    public state: PresenceControlStateService,
    public selectionService: PresenceControlGroupSelectionService,
    public groupService: PresenceControlGroupService,
    private settingsService: UserSettingsRestService,
    private subscriptionDetailService: SubscriptionDetailsRestService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.selectionService.selection$.subscribe(
      (selected) => (this.selected = selected as SubscriptionDetailWithName[])
    );
  }

  selectGroup(): void {
    this.openGroupModal(
      'presence-control.groups.all',
      this.selectCallback.bind(this)
    );
  }

  assignGroup(): void {
    this.openGroupModal(
      'presence-control.groups.none',
      this.assignCallback.bind(this)
    );
  }

  openGroupModal(
    emtpyLabel: string,
    callback: (selectedGroup: GroupOptions) => void
  ): void {
    combineLatest([
      this.state.getSubscriptionDetailForGroupEvent(),
      this.groupService.savedGroupView$,
    ])
      .pipe(take(1))
      .subscribe(([subscriptionDetail, groupView]) => {
        const modalRef = this.modalService.open(
          PresenceControlGroupDialogComponent
        );
        modalRef.componentInstance.title =
          'presence-control.groups.assign.title';
        modalRef.componentInstance.emptyLabel = emtpyLabel;
        modalRef.componentInstance.subscriptionDetail = subscriptionDetail;
        modalRef.componentInstance.savedGroupView = groupView;

        modalRef.result.then(
          (selectedGroup) => {
            callback(selectedGroup);
          },
          () => {}
        );
      });
  }

  selectCallback(selectedGroup: GroupOptions): void {
    this.lessonId$
      .pipe(
        map((lessonId) => {
          if (lessonId) {
            const propertyBody: GroupViewType = {
              lessonId: String(lessonId),
              group: selectedGroup.id,
            };
            const cst = getUserSetting(
              'presenceControlGroupView',
              propertyBody
            );
            this.settingsService.updateUserSettingsCst(cst).subscribe();
            this.groupService.selectGroupView(propertyBody);
          }
        })
      )
      .subscribe();
  }

  assignCallback(selectedGroup: GroupOptions): void {
    this.selected.forEach((s) => {
      this.subscriptionDetailService
        .update(selectedGroup.id, s.detail)
        .subscribe(this.onSaveSuccess.bind(this));
    });
  }

  private onSaveSuccess(): void {
    this.state.reloadSubscriptionDetails();
    this.selectionService.clear();
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
