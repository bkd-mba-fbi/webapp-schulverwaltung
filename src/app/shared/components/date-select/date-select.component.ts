import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { uniqueId } from 'lodash-es';

@Component({
  selector: 'erz-date-select',
  templateUrl: './date-select.component.html',
  styleUrls: ['./date-select.component.scss'],
})
export class DateSelectComponent implements OnInit {
  @Input() value: Option<Date> = null;
  @Input() placeholder = 'shared.date-select.default-placeholder';
  @Output() valueChange = new EventEmitter<Option<Date>>();

  componentId = uniqueId('erz-date-select-');

  constructor() {}

  ngOnInit(): void {}
}
