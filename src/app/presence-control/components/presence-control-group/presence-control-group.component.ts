import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, combineLatest, EMPTY, forkJoin, of } from 'rxjs';
import { map, mapTo, pluck, switchMap, take } from 'rxjs/operators';
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
  backlinkQueryParams$ = this.route.queryParams.pipe(
    pluck('returnparams'),
    map(parseQueryString)
  );

  private lessonId$ = this.route.paramMap.pipe(
    map((params) => Number(params.get('id')))
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
    private toastr: ToastrService,
    private translate: TranslateService,
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

  private openGroupModal(
    emtpyLabel: string,
    callback: (selectedGroup: GroupOptions) => void
  ): void {
    combineLatest([
      this.groupService.getSubscriptionDetailForGroupEvent(),
      this.groupService.groupView$,
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

  private selectCallback(selectedGroup: GroupOptions): void {
    this.lessonId$
      .pipe(
        take(1),
        switchMap((lessonId) => {
          if (lessonId) {
            const propertyBody: GroupViewType = {
              lessonId: String(lessonId),
              group: selectedGroup.id,
            };
            const cst = getUserSetting('presenceControlGroupView', [
              propertyBody,
            ]);
            return this.settingsService
              .updateUserSettingsCst(cst)
              .pipe(mapTo(propertyBody));
          }
          return EMPTY;
        })
      )
      .subscribe(
        (propertyBody) =>
          propertyBody && this.groupService.selectGroupView(propertyBody)
      );
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

    this.toastr.success(
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
