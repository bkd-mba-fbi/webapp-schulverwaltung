import { Component, OnInit } from '@angular/core';
import {
  PresenceControlGroupService,
  PrimarySortKey,
  SortCriteria,
} from '../../services/presence-control-group.service';

@Component({
  selector: 'erz-presence-control-group',
  templateUrl: './presence-control-group.component.html',
  styleUrls: ['./presence-control-group.component.scss'],
})
export class PresenceControlGroupComponent implements OnInit {
  constructor(public groupService: PresenceControlGroupService) {}

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
}
