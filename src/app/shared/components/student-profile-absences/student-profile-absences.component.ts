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
import { Observable, combineLatest, ReplaySubject } from 'rxjs';
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

@Component({
  selector: 'erz-student-profile-absences',
  templateUrl: './student-profile-absences.component.html',
  styleUrls: ['./student-profile-absences.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentProfileAbsencesComponent implements OnInit, OnChanges {
  @Input() absences$?: Observable<ReadonlyArray<LessonPresence>>;
  @Input() selectionService: Option<ConfirmAbsencesSelectionService> = null;

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

  allSelected$ = combineLatest([
    this.lessonPresences$.pipe(filter(notNull)),
    this.selectionService$.pipe(switchMap((service) => service.selection$)),
  ]).pipe(
    map(
      ([lessonPresences, selection]) =>
        lessonPresences.length === selection.length
    )
  );

  constructor() {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.absences$) {
      this.lessonPresences$$.next(changes.absences$.currentValue);
    }
    if (changes.selectionService && changes.selectionService.currentValue) {
      changes.selectionService.currentValue.clear();
      this.selectionService$.next(changes.selectionService.currentValue);
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
    if (event.target !== checkbox) {
      checkbox.click();
    }
  }
}
