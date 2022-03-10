import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Test } from 'src/app/shared/models/test.model';

@Component({
  selector: 'erz-test-table-header',
  templateUrl: './test-table-header.component.html',
  styleUrls: ['./test-table-header.component.scss'],
})
export class TestTableHeaderComponent {
  @Input() test: Test;
  @Input() sortIndicator: string;

  @Output() changeSort = new EventEmitter<Test>();

  constructor() {}

  sortBy(test: Test) {
    this.changeSort.emit(test);
  }
}
