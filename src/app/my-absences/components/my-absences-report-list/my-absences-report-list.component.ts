import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  AfterViewInit,
  OnDestroy,
  Inject,
} from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subject, Observable, combineLatest } from 'rxjs';
import { map, take, takeUntil, switchMap } from 'rxjs/operators';

import { parseISOLocalDate } from 'src/app/shared/utils/date';
import { not } from 'src/app/shared/utils/filter';
import {
  ReportAbsencesFilter,
  MyAbsencesReportStateService,
} from '../../services/my-absences-report-state.service';
import { LessonPresence } from 'src/app/shared/models/lesson-presence.model';
import { PresenceTypesService } from 'src/app/shared/services/presence-types.service';
import { isAbsent } from 'src/app/presence-control/utils/presence-types';
import { SETTINGS, Settings } from 'src/app/settings';
import {
  PresenceCategory,
  getPresenceCategoryIcon,
} from 'src/app/presence-control/models/presence-control-entry.model';
import { PresenceType } from 'src/app/shared/models/presence-type.model';
import { MyAbsencesReportSelectionService } from '../../services/my-absences-report-selection.service';
import { ScrollPositionService } from 'src/app/shared/services/scroll-position.service';

@Component({
  selector: 'erz-my-absences-report-list',
  templateUrl: './my-absences-report-list.component.html',
  styleUrls: ['./my-absences-report-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyAbsencesReportListComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  filterFromParams$ = this.route.queryParams.pipe(map(createFilterFromParams));

  allSelected$ = combineLatest([
    this.selectionService.selection$,
    this.state.entries$.pipe(
      switchMap((entries) =>
        combineLatest(entries.map((e) => this.getPresenceType(e))),
      ),
    ),
  ]).pipe(
    map(
      ([selection, presenceTypes]) =>
        selection.length > 0 &&
        selection.length === presenceTypes.filter(not(isAbsent)).length,
    ),
  );

  private destroy$ = new Subject<void>();

  constructor(
    public state: MyAbsencesReportStateService,
    public selectionService: MyAbsencesReportSelectionService,
    private route: ActivatedRoute,
    private scrollPosition: ScrollPositionService,
    private presenceTypesService: PresenceTypesService,
    @Inject(SETTINGS) private settings: Settings,
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
  }

  ngAfterViewInit(): void {
    this.scrollPosition.restore();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  getPresenceCategory(
    lessonPresence: LessonPresence,
  ): Observable<Option<{ category: PresenceCategory; icon: string }>> {
    return this.getPresenceType(lessonPresence).pipe(
      map((type) => {
        if (isAbsent(type)) {
          if (
            lessonPresence.ConfirmationStateId ===
            this.settings.checkableAbsenceStateId
          ) {
            return {
              category: PresenceCategory.Unapproved,
              icon: getPresenceCategoryIcon(PresenceCategory.Unapproved),
            };
          }
          return {
            category: PresenceCategory.Absent,
            icon: getPresenceCategoryIcon(PresenceCategory.Absent),
          };
        }
        return null;
      }),
    );
  }

  getPresenceTypeDesignation(
    lessonPresence: LessonPresence,
  ): Observable<Option<string>> {
    return this.presenceTypesService.displayedTypes$.pipe(
      map(
        (types) =>
          (lessonPresence.TypeRef.Id &&
            types.find((t) => t.Id === lessonPresence.TypeRef.Id)
              ?.Designation) ||
          null,
      ),
    );
  }

  toggleAll(checked: boolean): void {
    combineLatest([
      this.state.entries$.pipe(take(1)),
      this.presenceTypesService.presenceTypes$.pipe(take(1)),
    ]).subscribe(([entries, presenceTypes]) => {
      const absentTypeIds = presenceTypes
        .filter((p) => isAbsent(p))
        .map((p) => p.Id);
      this.selectionService.clear(
        checked
          ? entries.filter(
              (e) =>
                e.TypeRef.Id == null || !absentTypeIds.includes(e.TypeRef.Id),
            )
          : null,
      );
    });
  }

  onRowClick(event: Event, row: HTMLElement): void {
    const checkbox = row.querySelector('input[type="checkbox"]');
    if (
      checkbox &&
      event.target !== checkbox &&
      !(event.target as HTMLElement).closest('.buttons')
    ) {
      (checkbox as HTMLInputElement).click();
    }
  }

  private getPresenceType(
    lessonPresence: LessonPresence,
  ): Observable<Option<PresenceType>> {
    return this.presenceTypesService.presenceTypes$.pipe(
      map(
        (types) =>
          (lessonPresence.TypeRef.Id &&
            types.find((t) => t.Id === lessonPresence.TypeRef.Id)) ||
          null,
      ),
    );
  }
}

function createFilterFromParams(params: Params): ReportAbsencesFilter {
  return {
    dateFrom: params.dateFrom ? parseISOLocalDate(params.dateFrom) : null,
    dateTo: params.dateTo ? parseISOLocalDate(params.dateTo) : null,
  };
}
