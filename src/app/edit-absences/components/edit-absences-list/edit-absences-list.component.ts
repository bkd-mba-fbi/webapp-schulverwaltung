import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy,
  AfterViewInit,
} from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil, take, map, pluck, filter } from 'rxjs/operators';

import {
  EditAbsencesStateService,
  EditAbsencesFilter,
} from '../../services/edit-absences-state.service';
import { EditAbsencesSelectionService } from '../../services/edit-absences-selection.service';
import { ScrollPositionService } from 'src/app/shared/services/scroll-position.service';
import { parseISOLocalDate } from 'src/app/shared/utils/date';
import { isTruthy } from 'src/app/shared/utils/filter';

@Component({
  selector: 'erz-edit-absences-list',
  templateUrl: './edit-absences-list.component.html',
  styleUrls: ['./edit-absences-list.component.scss'],
  providers: [EditAbsencesSelectionService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditAbsencesListComponent
  implements OnInit, AfterViewInit, OnDestroy {
  filterFromParams$ = this.route.queryParams.pipe(map(createFilterFromParams));
  profileReturnParams$ = this.state.queryParamsString$;

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
      .subscribe((filterValue) => this.state.setFilter(filterValue));

    // Clear selection when filter changes and new entries are being loaded
    this.state.validFilter$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.selectionService.clear());

    // Remember selected entries
    this.selectionService.selection$
      .pipe(takeUntil(this.destroy$))
      .subscribe((selected) => (this.state.selected = selected));

    // Reload entries for current filter when ?reload=true
    this.route.queryParams
      .pipe(take(1), pluck('reload'), filter(isTruthy))
      .subscribe(() => this.state.resetEntries());
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
      .subscribe((entries) =>
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
    educationalEvent: params.educationalEvent
      ? Number(params.educationalEvent)
      : null,
    studyClass: params.studyClass ? Number(params.studyClass) : null,
    dateFrom: params.dateFrom ? parseISOLocalDate(params.dateFrom) : null,
    dateTo: params.dateTo ? parseISOLocalDate(params.dateTo) : null,
    presenceType: params.presenceType ? Number(params.presenceType) : null,
    confirmationState: params.confirmationState
      ? Number(params.confirmationState)
      : null,
    incidentType: params.incidentType ? Number(params.presenceType) : null,
  };
}
