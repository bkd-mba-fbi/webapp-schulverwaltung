import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, combineLatest, of } from 'rxjs';
import { finalize, map, take } from 'rxjs/operators';
import { spread } from '../../../shared/utils/function';
import { PresenceControlGroupSelectionService } from '../../services/presence-control-group-selection.service';
import { PresenceControlStateService } from '../../services/presence-control-state.service';
import { sortSubscriptionDetails } from '../../utils/subscriptions-details';
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
})
export class PresenceControlGroupComponent implements OnInit {
  saving$ = new BehaviorSubject(false);

  private sortCriteriaSubject$ = new BehaviorSubject<SortCriteria>({
    primarySortKey: 'name',
    ascending: false,
  });
  sortCriteria$ = this.sortCriteriaSubject$.asObservable();

  subscriptions$ = this.state.getStudentsWithGroupInfo();

  sortedEntries$ = combineLatest([
    this.subscriptions$,
    this.sortCriteria$,
  ]).pipe(map(spread(sortSubscriptionDetails)));

  constructor(
    public state: PresenceControlStateService,
    public selectionService: PresenceControlGroupSelectionService,
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
    this.state
      .loadSubscriptionDetailForEventWithGroups()
      .pipe(take(1))
      .subscribe((subscriptionDetail) => {
        const modalRef = this.modalService.open(
          PresenceControlGroupDialogComponent
        );
        modalRef.componentInstance.title =
          'presence-control.groups.assign.title';
        modalRef.componentInstance.emptyLabel = emtpyLabel;
        modalRef.componentInstance.subscriptionDetail = subscriptionDetail;

        modalRef.result.then(
          (selectedGroup) => {
            callback(selectedGroup);
          },
          () => {}
        );
      });
  }

  selectCallback(selectedGroup: GroupOptions): void {
    console.log('selected:', selectedGroup);
  }

  assignCallback(selectedGroup: GroupOptions): void {
    this.saving$.next(true);

    this.selectionService.selection$
      .pipe(
        map((selectedStudents) =>
          this.state.updateSubscriptionDetails(
            selectedGroup.id,
            selectedStudents
          )
        ),
        finalize(() => this.saving$.next(false))
      )
      .subscribe(this.onSaveSuccess.bind(this));
  }

  private onSaveSuccess(): void {
    console.log('onSaveSuccess');
    // TODO reload
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
