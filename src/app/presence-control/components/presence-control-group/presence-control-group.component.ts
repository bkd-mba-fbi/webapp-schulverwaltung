import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';
import { SubscriptionDetail } from '../../../shared/models/subscription-detail.model';
import {
  PresenceControlGroupService,
  PrimarySortKey,
  SortCriteria,
} from '../../services/presence-control-group.service';
import { PresenceControlStateService } from '../../services/presence-control-state.service';
import { PresenceControlGroupDialogComponent } from '../presence-control-group-dialog/presence-control-group-dialog.component';

interface Student {
  id: number;
  eventId: number;
  group: Option<string>;
}

@Component({
  selector: 'erz-presence-control-group',
  templateUrl: './presence-control-group.component.html',
  styleUrls: ['./presence-control-group.component.scss'],
})
export class PresenceControlGroupComponent implements OnInit {
  subscriptions$ = this.state.loadSubscriptionDetailForRegistrationWithGroups();
  students$ = this.subscriptions$.pipe(
    map((subscriptions) => subscriptions.map((s) => this.createStudent(s)))
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

  createStudent(detail: SubscriptionDetail): Student {
    return {
      id: detail.IdPerson,
      eventId: detail.EventId,
      group: detail.Value,
    };
  }

  // TODO add person name to subscription detail in state service
  getName(personId: number): Observable<Maybe<string>> {
    return this.state.getStudentFullName(personId);
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
