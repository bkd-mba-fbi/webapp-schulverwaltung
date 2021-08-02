import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { take } from 'rxjs/operators';
import {
  PresenceControlGroupService,
  PrimarySortKey,
  SortCriteria,
} from '../../services/presence-control-group.service';
import { PresenceControlStateService } from '../../services/presence-control-state.service';
import { PresenceControlGroupDialogComponent } from '../presence-control-group-dialog/presence-control-group-dialog.component';

@Component({
  selector: 'erz-presence-control-group',
  templateUrl: './presence-control-group.component.html',
  styleUrls: ['./presence-control-group.component.scss'],
})
export class PresenceControlGroupComponent implements OnInit {
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
    this.state
      .loadSubscriptionDetailForEventWithGroups()
      .pipe(take(1))
      .subscribe((subscriptionDetail) => {
        const modalRef = this.modalService.open(
          PresenceControlGroupDialogComponent
        );
        modalRef.componentInstance.title =
          'presence-control.groups.select.title';
        modalRef.componentInstance.emptyLabel = 'presence-control.groups.all';
        modalRef.componentInstance.subscriptionDetail = subscriptionDetail;
      });
  }

  assignGroup(): void {
    const modalRef = this.modalService.open(
      PresenceControlGroupDialogComponent
    );
    modalRef.componentInstance.title = 'presence-control.groups.assign.title';
    modalRef.componentInstance.emptyLabel = 'presence-control.groups.none';
  }
}
