import { AsyncPipe, DatePipe, NgClass } from "@angular/common";
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  inject,
} from "@angular/core";
import { RouterLink } from "@angular/router";
import { TranslatePipe } from "@ngx-translate/core";
import { Subject } from "rxjs";
import { take } from "rxjs/operators";
import { ConfirmAbsencesSelectionService } from "src/app/shared/services/confirm-absences-selection.service";
import { ScrollPositionService } from "src/app/shared/services/scroll-position.service";
import { ResettableInputComponent } from "../../../shared/components/resettable-input/resettable-input.component";
import { SortableHeaderComponent } from "../../../shared/components/sortable-header/sortable-header.component";
import { SpinnerComponent } from "../../../shared/components/spinner/spinner.component";
import { DaysDifferencePipe } from "../../../shared/pipes/days-difference.pipe";
import { OpenAbsencesEntry } from "../../models/open-absences-entry.model";
import {
  OpenAbsencesService,
  SORT_KEYS,
} from "../../services/open-absences.service";

@Component({
  selector: "bkd-open-absences-list",
  templateUrl: "./open-absences-list.component.html",
  styleUrls: ["./open-absences-list.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ResettableInputComponent,
    RouterLink,
    SpinnerComponent,
    AsyncPipe,
    DatePipe,
    TranslatePipe,
    DaysDifferencePipe,
    SortableHeaderComponent,
    NgClass,
  ],
})
export class OpenAbsencesListComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  protected readonly openAbsencesService = inject(OpenAbsencesService);
  protected readonly selectionService = inject(ConfirmAbsencesSelectionService);
  private readonly scrollPosition = inject(ScrollPositionService);

  protected readonly sortKeys = SORT_KEYS;
  private readonly destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.openAbsencesService.currentDetail = null;
    this.selectionService.clearNonOpenAbsencesEntries();
  }

  ngAfterViewInit(): void {
    this.scrollPosition.restore();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  protected onToggleAll(checked: boolean): void {
    this.openAbsencesService.filteredEntries$
      .pipe(take(1))
      .subscribe((entries) => {
        this.selectionService.clear(checked ? entries : null);
      });
  }

  protected onCheckboxCellClick(
    event: Event,
    checkbox: HTMLInputElement,
  ): void {
    if (event.target !== checkbox) {
      checkbox.click();
    }
  }
  protected getLessonsCountKey(entry: OpenAbsencesEntry): string {
    const suffix = entry.lessonsCount === 1 ? "singular" : "plural";
    return `open-absences.list.content.lessonsCount.${suffix}`;
  }
}
