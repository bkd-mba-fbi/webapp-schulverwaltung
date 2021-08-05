import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { SubscriptionDetail } from '../../../shared/models/subscription-detail.model';
import {
  PresenceControlGroupService,
  PrimarySortKey,
  SortCriteria,
} from '../../services/presence-control-group.service';
import { PresenceControlStateService } from '../../services/presence-control-state.service';
import { PresenceControlGroupDialogComponent } from '../presence-control-group-dialog/presence-control-group-dialog.component';

export type SubscriptionDetailWithName = {
  id: number;
  name: Maybe<string>;
  detail: SubscriptionDetail;
};

@Component({
  selector: 'erz-presence-control-group',
  templateUrl: './presence-control-group.component.html',
  styleUrls: ['./presence-control-group.component.scss'],
})
export class PresenceControlGroupComponent implements OnInit {
  subscriptions$ = this.state.loadSubscriptionDetailsForRegistrationWithGroups(); // TODO load in state service or loading spinner

  constructor(
    public groupService: PresenceControlGroupService,
    public state: PresenceControlStateService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {}

  getSortDirectionCharacter(
    sortCriteria: SortCriteria,
    sortKey: PrimarySortKey
  ): string {
    if (sortCriteria.primarySortKey !== sortKey) {
      return '';
    }
    return sortCriteria.ascending ? '↓' : '↑';
  }

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
}
