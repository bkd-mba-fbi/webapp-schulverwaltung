import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { map, take, tap } from 'rxjs/operators';
import { PresenceControlEntry } from '../../models/presence-control-entry.model';
import {
  PresenceControlGroupService,
  PrimarySortKey,
  SortCriteria,
} from '../../services/presence-control-group.service';
import { PresenceControlStateService } from '../../services/presence-control-state.service';
import { PresenceControlGroupDialogComponent } from '../presence-control-group-dialog/presence-control-group-dialog.component';

interface Student {
  name: string;
  group: Option<string>;
}

@Component({
  selector: 'erz-presence-control-group',
  templateUrl: './presence-control-group.component.html',
  styleUrls: ['./presence-control-group.component.scss'],
})
export class PresenceControlGroupComponent implements OnInit {
  // TODO
  students$ = this.state.selectedPresenceControlEntries$.pipe(
    map((entries) => entries.map((entry) => this.createStudent(entry)))
  );

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

  createStudent(entry: PresenceControlEntry): Student {
    return {
      name: entry.studentFullName,
      group: null,
    };
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
