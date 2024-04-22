import { AsyncPipe, DatePipe, NgFor, NgIf } from "@angular/common";
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from "@angular/core";
import { RouterLink } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { Subject } from "rxjs";
import { take } from "rxjs/operators";
import { ConfirmAbsencesSelectionService } from "src/app/shared/services/confirm-absences-selection.service";
import { ScrollPositionService } from "src/app/shared/services/scroll-position.service";
import { SortCriteria } from "src/app/shared/utils/sort";
import { ResettableInputComponent } from "../../../shared/components/resettable-input/resettable-input.component";
import { SpinnerComponent } from "../../../shared/components/spinner/spinner.component";
import { LetDirective } from "../../../shared/directives/let.directive";
import { DaysDifferencePipe } from "../../../shared/pipes/days-difference.pipe";
import { OpenAbsencesEntry } from "../../models/open-absences-entry.model";
import {
  OpenAbsencesService,
  PrimarySortKey,
} from "../../services/open-absences.service";

@Component({
  selector: "bkd-open-absences-list",
  templateUrl: "./open-absences-list.component.html",
  styleUrls: ["./open-absences-list.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    LetDirective,
    NgIf,
    ResettableInputComponent,
    RouterLink,
    NgFor,
    SpinnerComponent,
    AsyncPipe,
    DatePipe,
    TranslateModule,
    DaysDifferencePipe,
  ],
})
export class OpenAbsencesListComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  primarySortKeys: ReadonlyArray<PrimarySortKey> = ["name", "date"];
  private destroy$ = new Subject<void>();

  constructor(
    public openAbsencesService: OpenAbsencesService,
    public selectionService: ConfirmAbsencesSelectionService,
    private scrollPosition: ScrollPositionService,
  ) {}

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

  onToggleAll(checked: boolean): void {
    this.openAbsencesService.filteredEntries$
      .pipe(take(1))
      .subscribe((entries) => {
        this.selectionService.clear(checked ? entries : null);
      });
  }

  onCheckboxCellClick(event: Event, checkbox: HTMLInputElement): void {
    if (event.target !== checkbox) {
      checkbox.click();
    }
  }

  getSortDirectionCharacter(
    sortCriteria: SortCriteria<PrimarySortKey>,
    sortKey: PrimarySortKey,
  ): string {
    if (sortCriteria.primarySortKey !== sortKey) {
      return "";
    }
    return sortCriteria.ascending ? "↓" : "↑";
  }

  getLessonsCountKey(entry: OpenAbsencesEntry): string {
    const suffix = entry.lessonsCount === 1 ? "singular" : "plural";
    return `open-absences.list.content.lessonsCount.${suffix}`;
  }
}
