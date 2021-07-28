import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  PresenceControlGroupService,
  PrimarySortKey,
  SortCriteria,
} from '../../services/presence-control-group.service';
import { PresenceControlGroupDialogComponent } from '../presence-control-group-dialog/presence-control-group-dialog.component';

@Component({
  selector: 'erz-presence-control-group',
  templateUrl: './presence-control-group.component.html',
  styleUrls: ['./presence-control-group.component.scss'],
})
export class PresenceControlGroupComponent implements OnInit {
  constructor(
    public groupService: PresenceControlGroupService,
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
    const modalRef = this.modalService.open(
      PresenceControlGroupDialogComponent
    );
    modalRef.componentInstance.title = 'presence-control.groups.select.title';
    modalRef.componentInstance.emptyLabel = 'presence-control.groups.all';
  }

  assignGroup(): void {
    const modalRef = this.modalService.open(
      PresenceControlGroupDialogComponent
    );
    modalRef.componentInstance.title = 'presence-control.groups.assign.title';
    modalRef.componentInstance.emptyLabel = 'presence-control.groups.none';
  }
}
