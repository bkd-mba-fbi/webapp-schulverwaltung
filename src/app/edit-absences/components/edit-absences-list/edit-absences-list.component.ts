import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy,
  AfterViewInit
} from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil, take, map } from 'rxjs/operators';

import {
  EditAbsencesStateService,
  EditAbsencesFilter
} from '../../services/edit-absences-state.service';
import { EditAbsencesSelectionService } from '../../services/edit-absences-selection.service';
import { ScrollPositionService } from 'src/app/shared/services/scroll-position.service';
import { parseISOLocalDate } from 'src/app/shared/utils/date';

@Component({
  selector: 'erz-edit-absences-list',
  templateUrl: './edit-absences-list.component.html',
  styleUrls: ['./edit-absences-list.component.scss'],
  providers: [EditAbsencesSelectionService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditAbsencesListComponent
  implements OnInit, AfterViewInit, OnDestroy {
  filterFromParams$ = this.route.queryParams.pipe(map(createFilterFromParams));

  private destroy$ = new Subject();

  constructor(
    public state: EditAbsencesStateService,
    public selectionService: EditAbsencesSelectionService,
    private scrollPosition: ScrollPositionService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Load list with filter from query params
    this.filterFromParams$
      .pipe(take(1))
      .subscribe(filter => this.state.setFilter(filter));

    // Clear selection when filter changes and new entries are being loaded
    this.state.validFilter$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.selectionService.clear());

    // Remember selected entries
    this.selectionService.selectedIds$
      .pipe(takeUntil(this.destroy$))
      .subscribe(ids => (this.state.selected = ids));
  }

  ngAfterViewInit(): void {
    this.scrollPosition.restore();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  toggleAll(checked: boolean): void {
    this.state.entries$
      .pipe(take(1))
      .subscribe(entries =>
        this.selectionService.clear(checked ? entries : null)
      );
  }

  onCheckboxCellClick(event: Event, checkbox: HTMLInputElement): void {
    if (event.target !== checkbox) {
      checkbox.click();
    }
  }

  onScroll(): void {
    this.state.nextPage();
  }
}

function createFilterFromParams(params: Params): EditAbsencesFilter {
  return {
    student: params.student ? Number(params.student) : null,
    moduleInstance: params.moduleInstance
      ? Number(params.moduleInstance)
      : null,
    studyClass: params.studyClass ? Number(params.studyClass) : null,
    dateFrom: params.dateFrom ? parseISOLocalDate(params.dateFrom) : null,
    dateTo: params.dateTo ? parseISOLocalDate(params.dateTo) : null,
    presenceType: params.presenceType ? Number(params.presenceType) : null,
    confirmationState: params.confirmationState
      ? Number(params.confirmationState)
      : null
  };
}
