import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { spread } from '../../../shared/utils/function';
import { PresenceControlGroupSelectionService } from '../../services/presence-control-group-selection.service';
import { PresenceControlStateService } from '../../services/presence-control-state.service';
import { sortSubscriptionDetails } from '../../utils/subscriptions-details';
import { PresenceControlGroupDialogComponent } from '../presence-control-group-dialog/presence-control-group-dialog.component';

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
    this.openGroupModal('presence-control.groups.all');
  }

  assignGroup(): void {
    this.openGroupModal('presence-control.groups.none');
  }

  openGroupModal(emtpyLabel: string): void {
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
            console.log(selectedGroup);
          },
          () => {}
        );
      });
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
