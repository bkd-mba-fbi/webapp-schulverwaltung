import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
} from '@angular/core';

import { DropDownItem } from '../../models/drop-down-item.model';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'erz-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
})
export class SelectComponent implements OnChanges {
  @Input() options: ReadonlyArray<DropDownItem> = [];
  @Input() allowEmpty = true;
  @Input() emptyLabel: string = '';
  @Input() value: Option<number> = null;
  @Input() disabled: boolean = false;
  @Output() valueChange = new EventEmitter<Option<number>>();

  options$ = new BehaviorSubject<ReadonlyArray<DropDownItem>>([]);
  rawValue$ = new BehaviorSubject<Option<number>>(null);

  value$ = combineLatest([this.rawValue$, this.options$]).pipe(
    map(
      ([rawValue, options]) =>
        (options && options.find((o) => o.Key === rawValue)) || null
    )
  );

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.value) {
      this.rawValue$.next(changes.value.currentValue);
    }
    if (changes.options) {
      this.options$.next(changes.options.currentValue);
    }
  }
}
