import { Component, Input, Output, EventEmitter } from '@angular/core';

import { DropDownItem } from '../../models/drop-down-item.model';

@Component({
  selector: 'erz-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
})
export class SelectComponent {
  @Input() options: ReadonlyArray<DropDownItem> = [];
  @Input() value: Option<number> = null;
  @Output() valueChange = new EventEmitter<Option<number>>();

  constructor() {}

  itemChanged(): void {
    this.valueChange.emit(this.value);
  }
}
