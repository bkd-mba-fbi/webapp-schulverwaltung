import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
} from '@angular/core';

import { DropDownGroupedItem } from '../../models/drop-down-grouped-item.model';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'erz-multiselect',
  templateUrl: './multiselect.component.html',
  styleUrls: ['./multiselect.component.scss'],
})
export class MultiselectComponent implements OnInit, OnChanges {
  @Input() options: ReadonlyArray<DropDownGroupedItem> = [];
  @Input() values: Option<number> = null;
  @Output() valuesChange = new EventEmitter<Option<number>[]>();

  options$ = new BehaviorSubject<ReadonlyArray<DropDownGroupedItem>>([]);
  rawValues$ = new BehaviorSubject<Option<number[]>>(null);

  values$ = combineLatest([this.rawValues$, this.options$]).pipe(
    map(
      ([rawValues, options]) =>
        (options &&
          rawValues &&
          options.filter((o: DropDownGroupedItem) =>
            rawValues.includes(o.Key)
          )) ||
        null
    )
  );

  constructor() {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.values) {
      this.rawValues$.next(changes.values.currentValue);
    }
    if (changes.options) {
      this.options$.next(changes.options.currentValue);
    }
  }

  onChange(newValue: DropDownGroupedItem[]): void {
    let value: number[] = [];
    if (newValue && Array.isArray(newValue)) {
      value = newValue // emit array with only keys
        .map((v) => v?.Key);
    }
    this.valuesChange.emit(value);
  }
}
