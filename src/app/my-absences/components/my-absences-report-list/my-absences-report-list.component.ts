import { AsyncPipe, DatePipe } from "@angular/common";
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  inject,
} from "@angular/core";
import { ActivatedRoute, Params, RouterLink } from "@angular/router";
import { TranslatePipe } from "@ngx-translate/core";
import { Observable, Subject, combineLatest } from "rxjs";
import { map, switchMap, take, takeUntil } from "rxjs/operators";
import {
  PresenceCategory,
  getPresenceCategoryIcon,
} from "src/app/presence-control/models/presence-control-entry.model";
import { isAbsent } from "src/app/presence-control/utils/presence-types";
import { SETTINGS, Settings } from "src/app/settings";
import { LessonPresence } from "src/app/shared/models/lesson-presence.model";
import { PresenceType } from "src/app/shared/models/presence-type.model";
import { PresenceTypesService } from "src/app/shared/services/presence-types.service";
import { ScrollPositionService } from "src/app/shared/services/scroll-position.service";
import { parseISOLocalDate } from "src/app/shared/utils/date";
import { not } from "src/app/shared/utils/filter";
import { SpinnerComponent } from "../../../shared/components/spinner/spinner.component";
import { DaysDifferencePipe } from "../../../shared/pipes/days-difference.pipe";
import { MyAbsencesReportSelectionService } from "../../services/my-absences-report-selection.service";
import {
  MyAbsencesReportStateService,
  ReportAbsencesFilter,
} from "../../services/my-absences-report-state.service";
import { MyAbsencesReportHeaderComponent } from "../my-absences-report-header/my-absences-report-header.component";

@Component({
  selector: "bkd-my-absences-report-list",
  templateUrl: "./my-absences-report-list.component.html",
  styleUrls: ["./my-absences-report-list.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MyAbsencesReportHeaderComponent,
    RouterLink,
    SpinnerComponent,
    AsyncPipe,
    DatePipe,
    TranslatePipe,
    DaysDifferencePipe,
  ],
})
export class MyAbsencesReportListComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  state = inject(MyAbsencesReportStateService);
  selectionService = inject(MyAbsencesReportSelectionService);
  private route = inject(ActivatedRoute);
  private scrollPosition = inject(ScrollPositionService);
  private presenceTypesService = inject(PresenceTypesService);
  private settings = inject<Settings>(SETTINGS);

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
      !(event.target as HTMLElement).closest(".buttons")
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
    dateFrom: params["dateFrom"] ? parseISOLocalDate(params["dateFrom"]) : null,
    dateTo: params["dateTo"] ? parseISOLocalDate(params["dateTo"]) : null,
  };
}
