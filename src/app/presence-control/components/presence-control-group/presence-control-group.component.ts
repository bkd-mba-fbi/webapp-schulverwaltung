import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, combineLatest, of } from 'rxjs';
import { finalize, map, pluck, take } from 'rxjs/operators';
import { GroupViewType } from '../../../shared/models/user-setting.model';
import { SubscriptionDetailsRestService } from '../../../shared/services/subscription-details-rest.service';
import { UserSettingsRestService } from '../../../shared/services/user-settings-rest.service';
import { spread } from '../../../shared/utils/function';
import { parseQueryString } from '../../../shared/utils/url';
import { getUserSetting } from '../../../shared/utils/user-settings';
import { PresenceControlGroupSelectionService } from '../../services/presence-control-group-selection.service';
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

  private sortCriteriaSubject$ = new BehaviorSubject<SortCriteria>({
    primarySortKey: 'name',
    ascending: false,
  });
  sortCriteria$ = this.sortCriteriaSubject$.asObservable();

  subscriptions$ = this.state.getSubscriptionDetailsForStudents();

  sortedEntries$ = combineLatest([
    this.subscriptions$,
    this.sortCriteria$,
  ]).pipe(map(spread(sortSubscriptionDetails)));

  constructor(
    private route: ActivatedRoute,
    public state: PresenceControlStateService,
    public selectionService: PresenceControlGroupSelectionService,
    private settingsService: UserSettingsRestService,
    private subscriptionDetailService: SubscriptionDetailsRestService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {}

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
      this.state.savedGroupView$,
    ])
      .pipe(take(1))
      .subscribe(([subscriptionDetail, group]) => {
        const modalRef = this.modalService.open(
          PresenceControlGroupDialogComponent
        );
        modalRef.componentInstance.title =
          'presence-control.groups.assign.title';
        modalRef.componentInstance.emptyLabel = emtpyLabel;
        modalRef.componentInstance.subscriptionDetail = subscriptionDetail;
        modalRef.componentInstance.savedGroup = group;

        modalRef.result.then(
          (selectedGroup) => {
            callback(selectedGroup);
          },
          () => {}
        );
      });
  }

  selectCallback(selectedGroup: GroupOptions): void {
    this.state.selectedLesson$
      .pipe(
        map((lesson) => {
          if (lesson) {
            const propertyBody: GroupViewType = {
              lessonId: lesson.id,
              group: selectedGroup.id,
            };
            const cst = getUserSetting(
              'presenceControlGroupView',
              propertyBody
            );
            this.settingsService
              .updateUserSettingsCst(cst)
              .subscribe(() => this.state.selectGroupView(selectedGroup.id));
          }
        })
      )
      .subscribe(this.onSaveSuccess.bind(this));
  }

  assignCallback(selectedGroup: GroupOptions): void {
    this.saving$.next(true);

    this.selectionService.selection$
      .pipe(
        map((selectedStudents) =>
          selectedStudents.forEach((s) => {
            this.subscriptionDetailService
              .update(selectedGroup.id, s.detail)
              .subscribe();
          })
        ),
        finalize(() => this.saving$.next(false))
      )
      .subscribe(this.onSaveSuccess.bind(this));
  }

  private onSaveSuccess(): void {
    this.state.reloadSubscriptionDetails();
    // TODO success toast
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
