import {
  Component,
  OnInit,
  Input,
  SimpleChanges,
  OnChanges,
  ChangeDetectionStrategy,
  ViewChildren,
  QueryList,
  ElementRef,
} from '@angular/core';
import {
  Observable,
  combineLatest,
  ReplaySubject,
  BehaviorSubject,
  of,
} from 'rxjs';
import {
  switchMap,
  filter,
  map,
  take,
  startWith,
  switchAll,
  mapTo,
  shareReplay,
} from 'rxjs/operators';

import { LessonPresence } from '../../models/lesson-presence.model';
import { notNull, not } from '../../utils/filter';
import { isArray } from '../../utils/array';
import { ConfirmAbsencesSelectionService } from '../../services/confirm-absences-selection.service';
import { PresenceTypesService } from '../../services/presence-types.service';

@Component({
  selector: 'erz-student-profile-absences',
  templateUrl: './student-profile-absences.component.html',
  styleUrls: ['./student-profile-absences.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentProfileAbsencesComponent implements OnInit, OnChanges {
  @Input() absences$?: Observable<ReadonlyArray<LessonPresence>>;
  @Input() selectionService: Option<ConfirmAbsencesSelectionService> = null;

  /**
   * Whether display the presence type's designation (but only if is
   * not the default absence type).
   */
  @Input() displayPresenceType = true;

  /**
   * If set to a string, this message will be displayed, if the
   * selection contains absences that have no absence type (i.e. the
   * default absence type). Also, entries without absence type will be
   * annotated.
   */
  @Input() defaultAbsenceSelectionMessage: Option<string> = null;

  /**
   * The report button be shown disabled if `reportAvailable` is true
   * but no `reportUrl` is given.
   */
  @Input() reportUrl: Option<string> = null;
  @Input() reportAvailable = false;

  @ViewChildren('checkbox') checkboxes: QueryList<ElementRef<HTMLInputElement>>;

  lessonPresences$$ = new ReplaySubject<
    Observable<ReadonlyArray<LessonPresence>>
  >(1);
  lessonPresences$ = this.lessonPresences$$.pipe(
    switchAll(),
    startWith(null),
    shareReplay(1)
  );
  loading$ = this.lessonPresences$.pipe(map(not(isArray)));

  selectionService$ = new ReplaySubject<ConfirmAbsencesSelectionService>(1);
  editable$ = this.selectionService$.pipe(mapTo(true), startWith(false));

  private displayPresenceType$ = new BehaviorSubject<boolean>(true);

  allSelected$ = combineLatest([
    this.lessonPresences$.pipe(filter(notNull)),
    this.selectionService$.pipe(switchMap((service) => service.selection$)),
  ]).pipe(
    map(
      ([lessonPresences, selection]) =>
        lessonPresences.length === selection.length
    )
  );

  constructor(private presenceTypesService: PresenceTypesService) {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.absences$) {
      this.lessonPresences$$.next(changes.absences$.currentValue);
    }
    if (changes.selectionService && changes.selectionService.currentValue) {
      changes.selectionService.currentValue.clear();
      this.selectionService$.next(changes.selectionService.currentValue);
    }
    if (changes.displayPresenceType) {
      this.displayPresenceType$.next(changes.displayPresenceType.currentValue);
    }
  }

  toggleAll(checked: boolean): void {
    if (checked) {
      this.lessonPresences$
        .pipe(take(1))
        .subscribe((absences) => this.selectionService?.clear(absences));
    } else {
      this.selectionService?.clear();
    }
  }

  /**
   * Reference the entries' checkboxes via QueryList, since it is
   * non-static (within ngIf) and can therefore not be referenced in
   * the template itself.
   */
  onRowClick(event: Event, indexOrCheckbox: number | HTMLInputElement): void {
    if (this.checkboxes.length === 0) return;

    let checkbox: HTMLInputElement;
    if (typeof indexOrCheckbox === 'number') {
      checkbox = this.checkboxes.toArray()[indexOrCheckbox].nativeElement;
    } else {
      checkbox = indexOrCheckbox;
    }
    if (
      event.target !== checkbox &&
      !Boolean((event.target as HTMLElement).closest('.buttons'))
    ) {
      checkbox.click();
    }
  }

  getPresenceTypeDesignation(
    absence: LessonPresence
  ): Observable<Option<string>> {
    return this.displayPresenceType$.pipe(
      switchMap((display) =>
        display ? this.presenceTypesService.displayedTypes$ : of([])
      ),
      map((types) =>
        absence.TypeRef.Id
          ? types.find((t) => t.Id === absence.TypeRef.Id)?.Designation || null
          : null
      )
    );
  }
}
