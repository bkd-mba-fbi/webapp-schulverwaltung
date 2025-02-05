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
import { InfiniteScrollDirective } from "ngx-infinite-scroll";
import { Subject } from "rxjs";
import { filter, map, take, takeUntil } from "rxjs/operators";
import { ScrollPositionService } from "src/app/shared/services/scroll-position.service";
import { parseISOLocalDate } from "src/app/shared/utils/date";
import { isTruthy } from "src/app/shared/utils/filter";
import { SpinnerComponent } from "../../../shared/components/spinner/spinner.component";
import { EditAbsencesSelectionService } from "../../services/edit-absences-selection.service";
import {
  EditAbsencesFilter,
  EditAbsencesStateService,
} from "../../services/edit-absences-state.service";
import { EditAbsencesHeaderComponent } from "../edit-absences-header/edit-absences-header.component";

@Component({
  selector: "bkd-edit-absences-list",
  templateUrl: "./edit-absences-list.component.html",
  styleUrls: ["./edit-absences-list.component.scss"],
  providers: [EditAbsencesSelectionService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    EditAbsencesHeaderComponent,
    InfiniteScrollDirective,
    RouterLink,
    SpinnerComponent,
    AsyncPipe,
    DatePipe,
    TranslatePipe,
  ],
})
export class EditAbsencesListComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  state = inject(EditAbsencesStateService);
  selectionService = inject(EditAbsencesSelectionService);
  private scrollPosition = inject(ScrollPositionService);
  private route = inject(ActivatedRoute);

  filterFromParams$ = this.route.queryParams.pipe(map(createFilterFromParams));
  profileReturnParams$ = this.state.queryParamsString$;

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

    // Remember selected entries
    this.selectionService.selection$
      .pipe(takeUntil(this.destroy$))
      .subscribe((selected) => (this.state.selected = selected));

    // Reload entries for current filter when ?reload=true
    this.route.queryParams
      .pipe(
        take(1),
        map(({ reload }) => reload),
        filter(isTruthy),
      )
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
        this.selectionService.clear(checked ? entries : null),
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
    student: params["student"] ? Number(params["student"]) : null,
    educationalEvent: params["educationalEvent"]
      ? Number(params["educationalEvent"])
      : null,
    studyClass: params["studyClass"] ? Number(params["studyClass"]) : null,
    teacher: params["teacher"] ?? null,
    dateFrom: params["dateFrom"] ? parseISOLocalDate(params["dateFrom"]) : null,
    dateTo: params["dateTo"] ? parseISOLocalDate(params["dateTo"]) : null,
    weekdays: params["weekdays"] ? params["weekdays"].split(",") : null,
    presenceTypes: params["presenceTypes"]
      ? params["presenceTypes"].split(",").map(Number)
      : null,
    confirmationStates: params["confirmationStates"]
      ? params["confirmationStates"].split(",").map(Number)
      : null,
    incidentTypes: params["incidentTypes"]
      ? params["incidentTypes"].split(",").map(Number)
      : null,
  };
}
