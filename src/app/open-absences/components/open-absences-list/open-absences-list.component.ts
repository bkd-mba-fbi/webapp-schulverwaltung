import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy
} from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import {
  OpenAbsencesService,
  SortCriteria,
  PrimarySortKey
} from '../../services/open-absences.service';
import { OpenAbsencesEntry } from '../../models/open-absences-entry.model';
import { OpenAbsencesEntriesSelectionService } from '../../services/open-absences-entries-selection.service';

@Component({
  selector: 'erz-open-absences-list',
  templateUrl: './open-absences-list.component.html',
  styleUrls: ['./open-absences-list.component.scss'],
  providers: [OpenAbsencesEntriesSelectionService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OpenAbsencesListComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  constructor(
    public openAbsencesService: OpenAbsencesService,
    public selection: OpenAbsencesEntriesSelectionService
  ) {}

  ngOnInit(): void {
    this.selection.selectedIds$
      .pipe(takeUntil(this.destroy$))
      .subscribe(ids => (this.openAbsencesService.selected = ids));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  onCheckboxCellClick(event: Event, checkbox: HTMLInputElement): void {
    if (event.target !== checkbox) {
      checkbox.click();
    }
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

  getDaysDifferenceKey(entry: OpenAbsencesEntry): string {
    let suffix = 'ago';
    if (entry.daysDifference === 0) {
      suffix = 'today';
    } else if (entry.daysDifference === 1) {
      suffix = 'tomorrow';
    } else if (entry.daysDifference === -1) {
      suffix = 'yesterday';
    } else if (entry.daysDifference > 0) {
      suffix = 'in';
    }
    return `open-absences.list.content.daysDifference.${suffix}`;
  }
}
