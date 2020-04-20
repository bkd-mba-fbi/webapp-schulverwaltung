import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
} from '@angular/core';

import { DropDownItem } from '../../models/drop-down-item.model';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'erz-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
})
export class SelectComponent implements OnInit, OnChanges {
  @Input() options: ReadonlyArray<DropDownItem> = [];
  @Input() allowEmpty = true;
  @Input() value: Option<number> = null;
  @Output() valueChange = new EventEmitter<Option<number>>();

  value$ = new BehaviorSubject<Option<DropDownItem>>(null);

  constructor() {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.value) {
      this.value$.next(
        this.options.find((o) => o.Key === changes.value.currentValue) || null
      );
    }
  }
}
