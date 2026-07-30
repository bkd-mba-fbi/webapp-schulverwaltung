import { AsyncPipe, DatePipe } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  effect,
  inject,
  input,
  viewChildren,
} from "@angular/core";
import { toObservable } from "@angular/core/rxjs-interop";
import { RouterLink } from "@angular/router";
import { TranslatePipe } from "@ngx-translate/core";
import { Observable, combineLatest, of } from "rxjs";
import {
  filter,
  map,
  shareReplay,
  startWith,
  switchAll,
  switchMap,
  take,
} from "rxjs/operators";
import { ReportInfo } from "src/app/shared/services/reports.service";
import { LessonPresence } from "../../../models/lesson-presence.model";
import { DaysDifferencePipe } from "../../../pipes/days-difference.pipe";
import { ConfirmAbsencesSelectionService } from "../../../services/confirm-absences-selection.service";
import { PresenceTypesService } from "../../../services/presence-types.service";
import { isArray } from "../../../utils/array";
import { not, notNull } from "../../../utils/filter";
import { ReportsLinkComponent } from "../../reports-link/reports-link.component";
import { SpinnerComponent } from "../../spinner/spinner.component";

@Component({
  selector: "bkd-student-absences-list",
  templateUrl: "./student-absences-list.component.html",
  styleUrls: ["./student-absences-list.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    ReportsLinkComponent,
    SpinnerComponent,
    AsyncPipe,
    DatePipe,
    TranslatePipe,
    DaysDifferencePipe,
  ],
})
export class StudentAbsencesListComponent {
  private readonly presenceTypesService = inject(PresenceTypesService);

  readonly absences$ =
    input<Observable<Option<ReadonlyArray<LessonPresence>>>>();
  readonly selectionService =
    input<Option<ConfirmAbsencesSelectionService>>(null);

  /**
   * Whether display the presence type's designation (but only if is
   * not the default absence type).
   */
  readonly displayPresenceType = input(true);

  /**
   * If set to a string, this message will be displayed, if the
   * selection contains absences that have no absence type (i.e. the
   * default absence type). Also, entries without absence type will be
   * annotated.
   */
  readonly defaultAbsenceSelectionMessage = input<Option<string>>(null);

  readonly reports = input<Option<ReadonlyArray<ReportInfo>>>(null);

  readonly confirmLink = input("confirm");

  /**
   * Whether to show a button opening the user's email client
   * The receiver address, subject and body is set in the mailto string
   */
  readonly displayEmail = input(false);
  readonly mailTo$ = input<Observable<string>>();

  private readonly checkboxes =
    viewChildren<ElementRef<HTMLInputElement>>("checkbox");

  protected lessonPresences$ = toObservable(this.absences$).pipe(
    filter(Boolean),
    switchAll(),
    startWith(null),
    shareReplay(1),
  );
  protected loading$ = this.lessonPresences$.pipe(map(not(isArray)));

  private readonly selectionService$ = toObservable(this.selectionService).pipe(
    filter(notNull),
    shareReplay(1),
  );
  protected editable$ = this.selectionService$.pipe(
    map(() => true),
    startWith(false),
  );

  protected allSelected$ = combineLatest([
    this.lessonPresences$.pipe(filter(notNull)),
    this.selectionService$.pipe(switchMap((service) => service.selection$)),
  ]).pipe(
    map(
      ([lessonPresences, selection]) =>
        lessonPresences.length === selection.length,
    ),
  );

  private readonly displayPresenceType$ = toObservable(
    this.displayPresenceType,
  );

  constructor() {
    effect(() => {
      const service = this.selectionService();
      if (service) {
        service.clear();
      }
    });
  }

  protected toggleAll(checked: boolean): void {
    if (checked) {
      this.lessonPresences$
        .pipe(take(1))
        .subscribe((absences) => this.selectionService()?.clear(absences));
    } else {
      this.selectionService()?.clear();
    }
  }

  /**
   * Reference the entries' checkboxes via QueryList, since it is
   * non-static (within @if) and can therefore not be referenced in
   * the template itself.
   */
  protected onRowClick(
    event: Event,
    indexOrCheckbox: number | HTMLInputElement,
  ): void {
    const checkboxes = this.checkboxes();
    if (checkboxes.length === 0) return;

    let checkbox: HTMLInputElement;
    if (typeof indexOrCheckbox === "number") {
      checkbox = checkboxes[indexOrCheckbox].nativeElement;
    } else {
      checkbox = indexOrCheckbox;
    }
    if (
      event.target !== checkbox &&
      !(event.target as HTMLElement).closest(".buttons")
    ) {
      checkbox.click();
    }
  }

  protected getPresenceTypeDesignation(
    absence: LessonPresence,
  ): Observable<Option<string>> {
    return this.displayPresenceType$.pipe(
      switchMap((display) =>
        display ? this.presenceTypesService.displayedTypes$ : of([]),
      ),
      map((types) =>
        absence.TypeRef.Id
          ? types.find((t) => t.Id === absence.TypeRef.Id)?.Designation || null
          : null,
      ),
    );
  }
}
