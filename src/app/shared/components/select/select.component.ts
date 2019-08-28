import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { DropDownItem } from '../../models/drop-down-item.model';

@Component({
  selector: 'erz-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss']
})
export class SelectComponent implements OnInit {
  @Input() options: ReadonlyArray<DropDownItem> = [];
  @Input() allowEmpty = true;
  @Input() value: Option<number> = null;
  @Output() valueChange = new EventEmitter<Option<number>>();

  constructor() {}

  ngOnInit(): void {}
}
