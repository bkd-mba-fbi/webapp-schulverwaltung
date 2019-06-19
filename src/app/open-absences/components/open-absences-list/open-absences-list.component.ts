import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import {
  OpenAbsencesService,
  SortCriteria,
  PrimarySortKey
} from '../../services/open-absences.service';
import { OpenAbsencesEntry } from '../../models/open-absences-entry.model';

@Component({
  selector: 'erz-open-absences-list',
  templateUrl: './open-absences-list.component.html',
  styleUrls: ['./open-absences-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OpenAbsencesListComponent implements OnInit {
  constructor(public openAbsencesService: OpenAbsencesService) {}

  ngOnInit(): void {}

  onCheckboxCellClick(event: Event, checkbox: HTMLInputElement): void {
    if (event.target !== checkbox) {
      checkbox.click();
    }
  }

  toggleEntry(entry: OpenAbsencesEntry, checked: boolean): void {
    // TODO
    console.log('toggleEntry', entry, checked);
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

  getLessonsCountKey(entry: OpenAbsencesEntry): string {
    const suffix = entry.lessonsCount === 1 ? 'singular' : 'plural';
    return `open-absences.list.content.lessonsCount.${suffix}`;
  }

  getDaysAgoKey(entry: OpenAbsencesEntry): string {
    let suffix = 'plural';
    if (entry.daysAgo === 0) {
      suffix = 'today';
    } else if (entry.daysAgo === 1) {
      suffix = 'yesterday';
    }
    return `open-absences.list.content.daysAgo.${suffix}`;
  }
}
