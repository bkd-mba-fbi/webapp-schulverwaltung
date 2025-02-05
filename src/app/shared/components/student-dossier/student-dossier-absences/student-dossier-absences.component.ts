import { AsyncPipe, DatePipe } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnChanges,
  QueryList,
  SimpleChanges,
  ViewChildren,
  inject,
  input,
} from "@angular/core";
import { RouterLink } from "@angular/router";
import { TranslatePipe } from "@ngx-translate/core";
import {
  BehaviorSubject,
  Observable,
  ReplaySubject,
  combineLatest,
  of,
} from "rxjs";
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
  selector: "bkd-student-dossier-absences",
  templateUrl: "./student-dossier-absences.component.html",
  styleUrls: ["./student-dossier-absences.component.scss"],
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
export class StudentDossierAbsencesComponent implements OnChanges {
  private presenceTypesService = inject(PresenceTypesService);

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
  @Input() defaultAbsenceSelectionMessage: Option<string> = null;

  @Input() reports: Option<ReadonlyArray<ReportInfo>> = null;

  readonly confirmLink = input("confirm");

  /**
   * Whether to show a button opening the user's email client
   * The receiver address, subject and body is set in the mailto string
   */
  readonly displayEmail = input(false);
  readonly mailTo$ = input<Observable<string>>();

  @ViewChildren("checkbox") checkboxes: QueryList<ElementRef<HTMLInputElement>>;

  lessonPresences$$ = new ReplaySubject<
    Observable<ReadonlyArray<LessonPresence>>
  >(1);
  lessonPresences$ = this.lessonPresences$$.pipe(
    switchAll(),
    startWith(null),
    shareReplay(1),
  );
  loading$ = this.lessonPresences$.pipe(map(not(isArray)));

  selectionService$ = new ReplaySubject<ConfirmAbsencesSelectionService>(1);
  editable$ = this.selectionService$.pipe(
    map(() => true),
    startWith(false),
  );

  private displayPresenceType$ = new BehaviorSubject<boolean>(true);

  allSelected$ = combineLatest([
    this.lessonPresences$.pipe(filter(notNull)),
    this.selectionService$.pipe(switchMap((service) => service.selection$)),
  ]).pipe(
    map(
      ([lessonPresences, selection]) =>
        lessonPresences.length === selection.length,
    ),
  );

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["absences$"]) {
      this.lessonPresences$$.next(changes["absences$"].currentValue);
    }
    if (
      changes["selectionService"] &&
      changes["selectionService"].currentValue
    ) {
      changes["selectionService"].currentValue.clear();
      this.selectionService$.next(changes["selectionService"].currentValue);
    }
    if (changes["displayPresenceType"]) {
      this.displayPresenceType$.next(
        changes["displayPresenceType"].currentValue,
      );
    }
  }

  toggleAll(checked: boolean): void {
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
  onRowClick(event: Event, indexOrCheckbox: number | HTMLInputElement): void {
    if (this.checkboxes.length === 0) return;

    let checkbox: HTMLInputElement;
    if (typeof indexOrCheckbox === "number") {
      checkbox = this.checkboxes.toArray()[indexOrCheckbox].nativeElement;
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

  getPresenceTypeDesignation(
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
