import { Component, Input, Output, EventEmitter } from '@angular/core';

import { DropDownGroupedItem } from '../../models/drop-down-grouped-item.model';

@Component({
  selector: 'erz-multiselect',
  templateUrl: './multiselect.component.html',
  styleUrls: ['./multiselect.component.scss'],
})
export class MultiselectComponent {
  @Input() options: ReadonlyArray<DropDownGroupedItem> = [];
  @Input() values: Option<number[]> = [];
  @Output() valuesChange = new EventEmitter<Option<number[]>>();

  constructor() {}

  itemsChanged(): void {
    this.valuesChange.emit(this.values);
  }
}
